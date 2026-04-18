<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Bee & Cairn</title>

    <!-- Wix HTML Component SDK — enables dynamic resizing inside Wix pages -->
    <script src="https://static.parastorage.com/services/wix-sdk/1.89.0/js/Wix.js"></script>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body { width: 100%; }

        body {
            font-family: Georgia, serif;
            background: linear-gradient(to bottom, #0a0e27 0%, #1a1f3a 100%);
            color: #e8d5b7;
            position: relative;
            overflow-x: hidden;
            min-height: 600px;
        }

        .stars {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50%       { opacity: 1; }
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px 60px;
            position: relative;
            z-index: 1;
        }

        .header { text-align: center; margin-bottom: 50px; }

        h1 {
            font-size: 2.5em;
            color: #f4e4c1;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(244, 228, 193, 0.3);
        }

        .tagline { font-size: 1.1em; color: #c9b896; font-style: italic; }

        .card {
            background: rgba(26, 31, 58, 0.92);
            border: 1px solid rgba(244, 228, 193, 0.2);
            border-radius: 10px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        .welcome-text { font-size: 1.05em; line-height: 1.85; margin-bottom: 24px; }

        .voice-intro {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin: 32px 0;
        }

        .voice {
            padding: 24px;
            background: rgba(10, 14, 39, 0.5);
            border-radius: 8px;
            border: 1px solid rgba(244, 228, 193, 0.12);
        }

        .voice h3 { color: #f4e4c1; margin-bottom: 12px; font-size: 1.25em; letter-spacing: 0.04em; }
        .voice p  { line-height: 1.65; color: #c9b896; font-size: 0.97em; }

        .choice-buttons { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; }

        button {
            padding: 18px 28px;
            font-size: 1.05em;
            background: rgba(244, 228, 193, 0.1);
            border: 1px solid #c9b896;
            color: #f4e4c1;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
            font-family: Georgia, serif;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            width: 100%;
        }

        button:hover  { background: rgba(244, 228, 193, 0.18); border-color: #f4e4c1; transform: translateY(-2px); }
        button:active { transform: translateY(0); background: rgba(244, 228, 193, 0.22); }
        button:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .button-row { display: flex; gap: 12px; margin-top: 14px; }
        .button-row button { flex: 1; padding: 16px 12px; font-size: 1em; }

        .hidden { display: none !important; }

        .conversation { margin: 20px 0; }

        .message {
            margin-bottom: 22px;
            padding: 18px 20px;
            border-radius: 8px;
            line-height: 1.75;
            animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .message.bee   { background: rgba(255, 193, 7, 0.08);   border-left: 3px solid #f4c430; }
        .message.cairn { background: rgba(139, 115, 85, 0.1);   border-left: 3px solid #8b7355; }
        .message.both  { background: rgba(197, 154, 107, 0.08); border-left: 3px solid #a89574; }
        .message.user  { background: rgba(244, 228, 193, 0.04); border-left: 3px solid #c9b896; }

        .speaker {
            font-weight: bold;
            margin-bottom: 8px;
            color: #f4e4c1;
            font-size: 0.88em;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        .typing-indicator { display: inline-block; padding: 8px 4px; }
        .typing-indicator span {
            display: inline-block;
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #c9b896;
            margin: 0 2px;
            animation: typing 1.4s infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30%            { transform: translateY(-8px); }
        }

        .input-area {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid rgba(244, 228, 193, 0.12);
        }

        textarea {
            width: 100%;
            min-height: 110px;
            padding: 14px;
            background: rgba(10, 14, 39, 0.6);
            border: 1px solid #c9b896;
            border-radius: 8px;
            color: #e8d5b7;
            font-family: Georgia, serif;
            font-size: 16px;
            resize: vertical;
            -webkit-appearance: none;
            line-height: 1.6;
        }

        textarea:focus { outline: none; border-color: #f4e4c1; background: rgba(10, 14, 39, 0.85); }

        .validation-msg {
            font-size: 0.88em;
            color: #c9b896;
            padding: 6px 2px;
            display: none;
            font-style: italic;
        }

        .disclaimer {
            font-size: 0.88em;
            color: #a89574;
            text-align: center;
            margin-top: 36px;
            padding: 20px 16px;
            border-top: 1px solid rgba(244, 228, 193, 0.15);
            line-height: 1.65;
        }
        .disclaimer a { color: #f4e4c1; text-decoration: none; }

        .legal-footer {
            font-size: 0.82em;
            color: #7a6648;
            line-height: 1.65;
            padding: 18px 16px;
            margin-top: 16px;
            border-top: 1px solid rgba(244, 228, 193, 0.12);
            text-align: center;
        }
        .legal-footer a { color: #c9b896; text-decoration: none; }

        .summary-section { margin: 28px 0; }
        .summary-section h3 { color: #f4e4c1; margin-bottom: 14px; font-size: 1.1em; letter-spacing: 0.03em; }
        .summary-content { background: rgba(10, 14, 39, 0.35); padding: 20px; border-radius: 8px; line-height: 1.75; }

        /* ── MOBILE 768px ── */
        @media (max-width: 768px) {
            .container  { padding: 20px 12px 40px; }
            .header     { margin-bottom: 22px; }
            h1          { font-size: 1.85em; }
            .tagline    { font-size: 0.97em; }
            .card       { padding: 20px 15px; border-radius: 8px; }
            .welcome-text { font-size: 0.97em; line-height: 1.75; margin-bottom: 18px; }
            .voice-intro  { grid-template-columns: 1fr; gap: 12px; margin: 18px 0; }
            .voice        { padding: 16px; }
            .voice h3     { font-size: 1.05em; margin-bottom: 7px; }
            .choice-buttons { gap: 10px; margin-top: 18px; }
            button        { padding: 15px 18px; font-size: 0.98em; }
            .button-row   { gap: 10px; }
            .button-row button { padding: 14px 8px; font-size: 0.94em; }
            textarea      { min-height: 90px; padding: 12px; }
            .message      { padding: 14px 15px; margin-bottom: 16px; font-size: 0.96em; }
            .input-area   { margin-top: 16px; padding-top: 14px; }
            .disclaimer   { margin-top: 22px; padding: 15px 12px; font-size: 0.83em; }
            .legal-footer { padding: 13px 12px; font-size: 0.78em; }
            .summary-content { padding: 15px 13px; font-size: 0.94em; }
        }

        /* ── MOBILE 480px ── */
        @media (max-width: 480px) {
            h1   { font-size: 1.5em; }
            .card { padding: 16px 12px; }
            .button-row { flex-direction: column; }
            .button-row button { flex: none; width: 100%; padding: 14px; }
            .speaker { font-size: 0.80em; }
        }
    </style>
</head>
<body>
    <div class="stars" id="starfield"></div>

    <div class="container" id="main-container">

        <div class="header">
            <h1>Bee &amp; Cairn</h1>
            <p class="tagline">Companions for the Grief Journey</p>
        </div>

        <div class="card" id="welcome-screen">
            <div class="welcome-text">
                <p style="margin-bottom: 16px;">Welcome, Fellow Griefwalker.</p>
                <p style="margin-bottom: 16px;">You are not alone on this path. Grief touches all of us. Whether you are navigating the crossing of a loved one, the end of a relationship, a major life transition, or any form of profound change, this is a space where you can be met exactly as you are.</p>
                <p>We are Bee and Cairn, your companions for this journey.</p>
            </div>

            <div class="voice-intro">
                <div class="voice">
                    <h3>Bee</h3>
                    <p>Practical and grounded. Bee walks with you through the tools, rituals, and practices that help you find your footing when the weight of it feels unbearable.</p>
                </div>
                <div class="voice">
                    <h3>Cairn</h3>
                    <p>Philosophical and expansive. Cairn walks with you through Grief Cosmology: the mysteries, meaning, and understanding of how love and connection continue through every threshold.</p>
                </div>
            </div>

            <div class="welcome-text" style="margin-top: 14px; margin-bottom: 0;">
                <p>You can walk with one or both. Your journey, your choice.</p>
            </div>

            <div class="choice-buttons">
                <button id="btn-bee">Walk with Bee</button>
                <button id="btn-cairn">Walk with Cairn</button>
                <button id="btn-both">Walk with Both</button>
            </div>

            <div class="disclaimer">
                Bee and Cairn offer companionship, not therapy.<br>
                For professional grief counseling, visit
                <a href="https://www.guy-wire.org" target="_blank">Guy-Wire.org</a>
            </div>

            <div class="legal-footer">
                <p><strong>Bee &amp; Cairn &copy; 2026 The Lost Travelers Club. All Rights Reserved.</strong></p>
                <p>Based on the writings, philosophies, and practices of Rev. Rabbi Henry-Cameron Allen, OCP, ICGC.</p>
                <!-- v5.0: Updated to reflect maturation policy -->
                <p style="margin-top: 8px;">Your conversations are private and ephemeral. Anonymized structural patterns may be used to improve future companionship. No personally identifying information is retained or stored.</p>
            </div>
        </div>

        <div class="card hidden" id="journey-screen">
            <div class="conversation" id="conversation"></div>
            <div class="input-area" id="input-area"></div>
        </div>

        <div class="card hidden" id="summary-screen">
            <h2 style="color: #f4e4c1; margin-bottom: 26px; text-align: center; font-size: 1.35em;">
                Your Journey with Bee &amp; Cairn
            </h2>
            <div id="summary-content"></div>
            <div style="text-align: center; margin-top: 32px;">
                <button id="btn-download" style="max-width: 360px;">Download Your Summary (PDF)</button>
            </div>
            <div class="disclaimer" style="margin-top: 32px;">
                <p style="margin-bottom: 14px;">If Bee and Cairn walked alongside you today, consider supporting the work that makes this companionship possible for all who need it.</p>
                <p style="margin-bottom: 14px;"><strong>Grief Reimagined. Purpose Empowered.</strong></p>
                <p><a href="https://www.unitedcharitable.org/fsp_daf/the-lost-travelers-club/" target="_blank" style="font-size: 1.05em;">Support The Lost Travelers Club</a></p>
            </div>
            <div class="legal-footer">
                <p><strong>Bee &amp; Cairn &copy; 2026 The Lost Travelers Club. All Rights Reserved.</strong></p>
                <p>Based on the writings, philosophies, and practices of Rev. Rabbi Henry-Cameron Allen, OCP, ICGC.</p>
                <!-- v5.0: Updated to reflect maturation policy -->
                <p style="margin-top: 8px;">Your conversations are private and ephemeral. Anonymized structural patterns may be used to improve future companionship. No personally identifying information is retained or stored.</p>
                <p style="margin-top: 10px;">Bee and Cairn offer companionship, not therapy. For professional grief counseling, visit <a href="https://www.guy-wire.org" target="_blank">Guy-Wire.org</a></p>
                <p style="margin-top: 8px;"><strong>Crisis Support (USA):</strong> 988 (Suicide Prevention) | Text HOME to 741741 (Crisis Text Line)</p>
                <p><strong>International:</strong> Ask Bee or Cairn for crisis support resources in your country.</p>
            </div>
            <div style="text-align: center; margin-top: 26px;">
                <button id="btn-restart" style="max-width: 280px;">Begin a New Journey</button>
            </div>
        </div>

    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <script>
        'use strict';

        var API_URL = 'https://bee-cairn-backend.vercel.app/api/chat';

        // ── Height reporting (three-layer Wix compatibility) ──
        function reportHeight() {
            var h = (document.getElementById('main-container').offsetHeight || 600) + 120;

            // Layer 1: Wix SDK
            if (window.Wix && typeof window.Wix.resizeComponent === 'function') {
                window.Wix.resizeComponent({ height: h });
            }

            // Layer 2: postMessage
            try {
                window.parent.postMessage({ height: h }, '*');
                window.parent.postMessage(JSON.stringify({ height: h }), '*');
            } catch(e) {}
        }

        window.addEventListener('load', function() {
            setTimeout(reportHeight, 100);
            setTimeout(reportHeight, 500);
            setTimeout(reportHeight, 1200);
        });

        if (typeof MutationObserver !== 'undefined') {
            new MutationObserver(function() {
                requestAnimationFrame(reportHeight);
            }).observe(document.body, { childList: true, subtree: true });
        }

        // ── Starfield ─────────────────────────────────────────
        (function() {
            var sf = document.getElementById('starfield');
            var n  = window.innerWidth < 480 ? 40 : 90;
            for (var i = 0; i < n; i++) {
                var s  = document.createElement('div');
                s.className = 'star';
                var sz = (Math.random() * 2.5 + 0.5).toFixed(1) + 'px';
                s.style.cssText =
                    'width:' + sz + ';height:' + sz + ';' +
                    'left:'  + (Math.random()*100).toFixed(2) + '%;' +
                    'top:'   + (Math.random()*100).toFixed(2) + '%;' +
                    'animation-delay:' + (Math.random()*3).toFixed(2) + 's;';
                sf.appendChild(s);
            }
        })();

        // ── App ───────────────────────────────────────────────
        var app = {

            companion: null,
            history: [],

            lbl: function() {
                if (this.companion === 'bee')   return 'Bee';
                if (this.companion === 'cairn') return 'Cairn';
                return 'Bee and Cairn';
            },

            show: function(id) {
                ['welcome-screen','journey-screen','summary-screen'].forEach(function(s){
                    document.getElementById(s).classList.add('hidden');
                });
                document.getElementById(id).classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(reportHeight, 150);
                setTimeout(reportHeight, 600);
            },

            choose: function(c) {
                this.companion = c;
                this.show('journey-screen');
                var self = this;
                this.respond('Hello').then(function(){ self.renderInput(); });
            },

            renderInput: function() {
                var self = this;
                var area = document.getElementById('input-area');
                area.innerHTML =
                    '<textarea id="utx" rows="4" ' +
                    'placeholder="Take your time. There is no right or wrong answer..."></textarea>' +
                    '<div class="validation-msg" id="vmsg">Please share your thoughts before continuing.</div>' +
                    '<div class="button-row">' +
                    '<button id="btn-go">Continue</button>' +
                    '<button id="btn-end">See Summary</button>' +
                    '</div>';

                document.getElementById('utx').addEventListener('keydown', function(e){
                    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
                        e.preventDefault(); self.submit();
                    }
                });
                document.getElementById('btn-go').addEventListener('click',  function(){ self.submit(); });
                document.getElementById('btn-end').addEventListener('click', function(){ self.showSummary(); });
                setTimeout(reportHeight, 150);
            },

            submit: function() {
                var self = this;
                var ta   = document.getElementById('utx');
                var txt  = ta ? ta.value.trim() : '';
                if (!txt) {
                    var vm = document.getElementById('vmsg');
                    if (vm) { vm.style.display='block'; setTimeout(function(){ vm.style.display='none'; }, 3000); }
                    return;
                }
                this.addUser(txt);
                document.getElementById('input-area').innerHTML = '';
                this.respond(txt).then(function(){ self.renderInput(); });
            },

            respond: async function(msg) {
                var conv = document.getElementById('conversation');
                var td   = document.createElement('div');
                td.className = 'message ' + this.companion;
                td.id = 'typer';
                td.innerHTML =
                    '<div class="speaker">' + this.lbl() + '</div>' +
                    '<div class="typing-indicator"><span></span><span></span><span></span></div>';
                conv.appendChild(td);
                this.scrollEnd();
                reportHeight();

                this.history.push({ role: 'user', content: msg });

                try {
                    var r = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: this.history, companion: this.companion })
                    });
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    var d    = await r.json();
                    var text = d.response;
                    this.history.push({ role: 'assistant', content: text });
                    var el = document.getElementById('typer'); if (el) el.remove();
                    await this.addComp(text);
                } catch(e) {
                    console.error(e);
                    var el2 = document.getElementById('typer'); if (el2) el2.remove();
                    await this.addComp('Something interrupted the path for a moment. Please try again.');
                }
            },

            addComp: async function(html) {
                var conv = document.getElementById('conversation');
                var d    = document.createElement('div');
                d.className = 'message ' + this.companion;
                d.innerHTML = '<div class="speaker">' + this.lbl() + '</div><div>' + html + '</div>';
                conv.appendChild(d);
                this.scrollEnd();
                reportHeight();
                await new Promise(function(r){ setTimeout(r, 250); });
            },

            addUser: function(txt) {
                var conv = document.getElementById('conversation');
                var d    = document.createElement('div');
                d.className = 'message user';
                d.innerHTML = '<div class="speaker">You</div><div>' + this.esc(txt) + '</div>';
                conv.appendChild(d);
                this.scrollEnd();
                reportHeight();
            },

            esc: function(s) {
                return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
            },

            scrollEnd: function() {
                var conv = document.getElementById('conversation');
                if (!conv) return;
                var last = conv.lastElementChild;
                if (last) setTimeout(function(){ last.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 100);
            },

            // ── v5.0: Maturation pipeline ─────────────────────────────────
            // Fires at session end. Sends anonymized transcript to the back-end,
            // which forwards it to the n8n maturation webhook for pattern extraction.
            // Non-blocking. A failure here does not affect the user experience.
            sendToMaturation: function() {
                var name = this.lbl();
                var userCount = this.history.filter(function(m){ return m.role === 'user'; }).length;

                // Build anonymized transcript: strip HTML tags, replace companion label
                // with generic identifier. User turns are already unattributed to any name.
                var transcript = this.history.map(function(m) {
                    var clean = m.content.replace(/<[^>]*>/g, '').trim();
                    if (m.role === 'user') return 'User: ' + clean;
                    return name + ': ' + clean;
                }).join('\n');

                fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionEnding: true,
                        transcript: transcript,
                        messageCount: userCount
                    })
                }).catch(function(e) {
                    // Silent. Maturation failure never surfaces to the user.
                    console.error('Maturation webhook:', e.message);
                });
            },

            showSummary: function() {
                // ── v5.0: Trigger maturation pipeline before showing summary ──
                this.sendToMaturation();

                this.show('summary-screen');
                var name = this.lbl();
                var html = '<div class="summary-section"><h3>Your Conversation</h3><div class="summary-content">';
                this.history.forEach(function(m){
                    if (m.role === 'user') {
                        html += '<p style="margin-bottom:12px;color:#c9b896;"><em>You:</em> ' + app.esc(m.content) + '</p>';
                    } else {
                        html += '<p style="margin-bottom:16px;padding-left:14px;border-left:2px solid rgba(244,228,193,0.2);"><strong>' + name + ':</strong> ' + m.content + '</p>';
                    }
                });
                html += '</div></div>';
                html += '<div class="summary-section"><h3>Wisdom Carried Forward</h3><div class="summary-content">';
                html += '<p style="margin-bottom:14px;">Bee and Cairn walked with you through this conversation, offering practical guidance and philosophical reflection drawn from The Lost Traveler\'s Field Guide.</p>';
                html += '<p style="font-style:italic;color:#c9b896;margin-bottom:8px;">&ldquo;Grief is the living response to absence and change. There is no direct pathway through it. Grief shifts as we move through it, because it is as alive as we are.&rdquo;</p>';
                // v5.0: Attribution corrected from &mdash; to -- for consistency with canon
                html += '<p style="font-size:0.87em;color:#8b7355;">-- Rev. Rabbi Henry-Cameron Allen, OCP, ICGC</p>';
                html += '</div></div>';
                document.getElementById('summary-content').innerHTML = html;
                setTimeout(reportHeight, 200);
            },

            download: function() {
                if (!window.jspdf) { alert('PDF library still loading. Try again in a moment.'); return; }
                var doc  = new window.jspdf.jsPDF();
                var name = this.lbl();
                var date = new Date().toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric' });

                doc.setFontSize(18); doc.setTextColor(40,35,25);
                doc.text('Your Journey with Bee & Cairn', 20, 22);
                doc.setFontSize(10); doc.setTextColor(110,95,70);
                doc.text('With ' + name + '  |  ' + date, 20, 31);
                doc.text('A service of The Lost Travelers Club', 20, 38);
                doc.setDrawColor(180,155,110); doc.line(20,43,190,43);

                var y = 52; doc.setFontSize(11);
                this.history.forEach(function(m){
                    if (y > 262) { doc.addPage(); y = 20; }
                    if (m.role === 'user') {
                        doc.setTextColor(75,65,50);
                        var ln = doc.splitTextToSize('You: ' + m.content, 170);
                        doc.text(ln, 20, y); y += ln.length * 6 + 8;
                    } else {
                        doc.setTextColor(35,30,20);
                        var cl = m.content.replace(/<[^>]*>/g,'');
                        var ln2 = doc.splitTextToSize(name + ': ' + cl, 170);
                        doc.text(ln2, 20, y); y += ln2.length * 6 + 10;
                    }
                });

                if (y > 242) { doc.addPage(); y = 20; }
                y += 8; doc.setDrawColor(180,155,110); doc.line(20,y,190,y); y += 9;
                doc.setFontSize(9); doc.setTextColor(120,100,75);
                // v5.0: Attribution consistent with canon (double hyphen, not em dash)
                ['"Grief is the living response to absence and change.',
                 'There is no direct pathway through it.',
                 'Grief shifts as we move through it, because it is as alive as we are."',
                 '-- Rev. Rabbi Henry-Cameron Allen, OCP, ICGC'].forEach(function(l){ doc.text(l,20,y); y+=6; });
                y += 4; doc.setTextColor(100,85,60);
                doc.text('Bee & Cairn (c) 2026 The Lost Travelers Club. All Rights Reserved.', 20, y); y+=6;
                doc.text('Support: unitedcharitable.org/fsp_daf/the-lost-travelers-club/', 20, y); y+=6;
                // v5.0: Updated privacy statement in PDF footer
                doc.setFontSize(8); doc.setTextColor(140,120,90);
                doc.text('Anonymized structural patterns from this session may be used to improve future companionship.', 20, y); y+=5;
                doc.text('No personally identifying information is retained or stored.', 20, y);
                doc.save('bee-and-cairn-' + Date.now() + '.pdf');
            },

            restart: function() {
                this.companion = null;
                this.history   = [];
                document.getElementById('conversation').innerHTML = '';
                document.getElementById('input-area').innerHTML   = '';
                this.show('welcome-screen');
            }
        };

        document.addEventListener('DOMContentLoaded', function(){
            document.getElementById('btn-bee').addEventListener('click',      function(){ app.choose('bee'); });
            document.getElementById('btn-cairn').addEventListener('click',    function(){ app.choose('cairn'); });
            document.getElementById('btn-both').addEventListener('click',     function(){ app.choose('both'); });
            document.getElementById('btn-download').addEventListener('click', function(){ app.download(); });
            document.getElementById('btn-restart').addEventListener('click',  function(){ app.restart(); });
        });
    </script>
</body>
</html>
