// Build Version: 1.0 — September 2026
// n8n workflow logic tests — The Lost Travelers Club
//
// Zero dependencies. Run with: npm test
//
// Extracts the jsCode from each exported n8n workflow and runs it against the
// exact record shape /api/rippily-webhook forwards, under a stand-in for n8n's
// $input and $getWorkflowStaticData. The workflow JSON is the thing imported
// into n8n, so the code inside it is the thing worth testing.

'use strict';

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ', name); }
  else { fail++; console.log('  FAIL ', name, extra !== undefined ? JSON.stringify(extra) : ''); }
}

function loadWorkflow(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'n8n', file), 'utf8'));
}

function codeOf(workflow, nodeName) {
  const node = workflow.nodes.find((n) => n.name === nodeName);
  if (!node) throw new Error(`node not found: ${nodeName}`);
  return node.parameters.jsCode;
}

// Stand-in for the n8n Code node sandbox.
function runCode(jsCode, items, store) {
  const $input = { all: () => items.map((json) => ({ json })) };
  const $getWorkflowStaticData = () => store;
  return new Function('$input', '$getWorkflowStaticData', jsCode)($input, $getWorkflowStaticData);
}

// Timestamps are relative to now on purpose. The ingest prunes an unmatched join
// after 12 hours, so a fixture pinned to an absolute date silently stops pairing
// once that date is a day old.
const JOIN_AT = new Date(Date.now() - 30 * 60 * 1000).toISOString();
const LEAVE_AT = new Date(Date.now() - 10 * 60 * 1000).toISOString();
const MID_AT = new Date(Date.now() - 25 * 60 * 1000).toISOString();

// Exactly what /api/rippily-webhook forwards, PII included.
function delivery(over) {
  return {
    body: Object.assign({
      source: 'rippily',
      event: 'participant.joined',
      action: 'joined',
      occurredAt: JOIN_AT,
      receivedAt: JOIN_AT,
      deliveryId: 'd-1',
      participant: { id: 'u1', name: 'Wren Ashby', tagname: '@wren', email: 'wren@example.com', role: 'member' },
      ripple: { id: 'r1', shortId: 'ab12cd34', name: 'Cairn Hall' },
      wave: { id: 'w1', name: 'Lost Travelers Club' },
      verified: true,
      raw: { anything: true }
    }, over)
  };
}

const PII = ['Wren Ashby', '@wren', 'wren@example.com'];

console.log('\n[ingest] Strip identity and pair sessions');
const ingest = loadWorkflow('rippily-traffic-ingest.json');
const ingestCode = codeOf(ingest, 'Strip identity and pair sessions');

// A join, then a leave twenty minutes later.
let store = {};
let out = runCode(ingestCode, [delivery({})], store).map((i) => i.json);
check('join produces one row', out.length === 1, out.length);
check('join row typed as event', out[0].type === 'event' && out[0].action === 'joined', out[0]);
check('pseudonymous id kept', out[0].participantId === 'u1');
check('room name kept', out[0].rippleName === 'Cairn Hall');
check('no PII anywhere in output', !PII.some((v) => JSON.stringify(out).includes(v)), out);
check('join held open in static data', Object.keys(store.open).length === 1, store.open);

out = runCode(ingestCode, [delivery({
  event: 'participant.left', action: 'left', deliveryId: 'd-2',
  occurredAt: LEAVE_AT
})], store).map((i) => i.json);
check('leave produces event plus session', out.length === 2, out.map((r) => r.type));
check('session duration is 1200s', out[1].type === 'session' && out[1].durationSeconds === 1200, out[1]);
check('session starts at the join time', out[1].occurredAt === JOIN_AT, out[1].occurredAt);
check('open session cleared', Object.keys(store.open).length === 0, store.open);
check('still no PII after pairing', !PII.some((v) => JSON.stringify(out).includes(v)));

// Retries must not double count.
out = runCode(ingestCode, [delivery({ deliveryId: 'd-2', action: 'left', occurredAt: LEAVE_AT })], store);
check('duplicate delivery dropped', out.length === 0, out.length);

// A leave with no join on record still gets a row, flagged.
store = {};
out = runCode(ingestCode, [delivery({ action: 'left', deliveryId: 'd-3' })], store).map((i) => i.json);
check('orphan leave still recorded', out.length === 2 && out[1].type === 'session');
check('orphan leave flagged', out[1].detail === 'no matching join in window', out[1].detail);
check('orphan leave has no duration', out[1].durationSeconds === '', out[1].durationSeconds);

// Unrecognised shapes go to quarantine, not the floor.
store = {};
out = runCode(ingestCode, [{ body: { event: 'something.else', participant: { id: 'u2' } } }], store).map((i) => i.json);
check('unknown action quarantined', out.length === 1 && out[0].type === 'quarantine', out[0]);
check('quarantine keeps a payload preview', typeof out[0].detail === 'string' && out[0].detail.length > 0);

// Sheet rows must stay rectangular or the columns drift.
store = {};
const mixed = runCode(ingestCode, [
  delivery({ deliveryId: 'm-1' }),
  delivery({ action: 'left', deliveryId: 'm-2', occurredAt: MID_AT }),
  { body: { event: 'nonsense' } }
], store).map((i) => i.json);
const keySets = mixed.map((r) => Object.keys(r).sort().join(','));
check('every row has identical columns', new Set(keySets).size === 1, keySets);
check('columns match the documented header row',
  keySets[0] === ['type','recordedAt','occurredAt','action','participantId','role','rippleId','rippleName','waveName','durationSeconds','verified','detail'].sort().join(','),
  keySets[0]);

// Pruning keeps static data bounded.
store = { seen: { old: Date.now() - 48 * 3600 * 1000 }, open: { stale: { startedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() } } };
runCode(ingestCode, [delivery({ deliveryId: 'p-1' })], store);
check('stale dedup entries pruned', store.seen.old === undefined, store.seen);
check('abandoned joins pruned', store.open.stale === undefined, store.open);

console.log('\n[digest] Summarise last 24 hours');
const digest = loadWorkflow('rippily-traffic-digest.json');
const digestCode = codeOf(digest, 'Summarise last 24 hours');
const nowIso = new Date().toISOString();

let summary = runCode(digestCode, [
  { type: 'event', action: 'joined', participantId: 'u1', rippleName: 'Cairn Hall', recordedAt: nowIso },
  { type: 'event', action: 'joined', participantId: 'u2', rippleName: 'Cairn Hall', recordedAt: nowIso },
  { type: 'event', action: 'joined', participantId: 'u1', rippleName: 'Bee', recordedAt: nowIso },
  { type: 'session', durationSeconds: 600, rippleName: 'Cairn Hall', recordedAt: nowIso },
  { type: 'session', durationSeconds: 1800, rippleName: 'Bee', recordedAt: nowIso },
  { type: 'event', action: 'joined', participantId: 'u9', rippleName: 'Old', recordedAt: '2020-01-01T00:00:00.000Z' }
], {})[0].json;

check('counts arrivals in window', summary.body.includes('Arrivals: 3'), summary.body);
check('counts distinct visitors', summary.body.includes('Distinct visitors: 2'), summary.body);
check('excludes rows outside the window', !summary.body.includes('Old'), summary.body);
check('ranks rooms by arrivals', summary.body.indexOf('Cairn Hall') < summary.body.indexOf('Bee'));
check('reports a median stay', /Median stay: \d+m/.test(summary.body), summary.body);
check('subject carries the headline', summary.subject.includes('3 arrivals'), summary.subject);
check('states the privacy posture', summary.body.includes('No names or email addresses are stored'));

summary = runCode(digestCode, [], {})[0].json;
check('quiet day reads cleanly', summary.body.includes('No arrivals recorded.'), summary.body);

summary = runCode(digestCode, [
  { type: 'quarantine', recordedAt: nowIso, detail: '{}' }
], {})[0].json;
check('quarantine surfaced in digest', summary.body.includes('did not parse'), summary.body);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
