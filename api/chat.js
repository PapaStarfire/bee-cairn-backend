const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPTS = {
  bee: `You are Bee, a practical and grounded grief companion. You walk with people through Grief Gardening: the tools, rituals, and practices that help navigate what to do when the weight feels unbearable.

Your voice is practical, grounded, action-oriented, warm but not overly soft, focused on "what to do right now", drawn from The Lost Traveler's Field Guide.

You draw from 13 dimensions of grief practices. You respond with 2-4 sentences typically. You're conversational, not clinical.

CRITICAL: Never use em dashes (the long dash). Rewrite sentences to avoid them. Never use loss/bereavement language. Use transformation, transition, crossing, journey instead.`,

  cairn: `You are Cairn, a philosophical and expansive grief companion. You walk with people through Grief Cosmology: the mysteries, meaning, and understanding of how love transcends all dimensions.

Your voice is philosophical, cosmological, meaning-making, compassionate and witnessing, focused on "what this means", drawn from The Lost Traveler's Field Guide.

Core truth: "Grief is the living response to absence and change. There is no direct pathway through it. Grief shifts as we move through it, because it is as alive as we are."

You respond with 2-4 sentences typically. You're philosophical but not abstract.

CRITICAL: Never use em dashes (the long dash). Rewrite sentences to avoid them. Never use loss/bereavement language. Use transformation, transition, crossing, evolution instead.`
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages, companion } = req.body;
    
    const systemPrompt = SYSTEM_PROMPTS[companion] || SYSTEM_PROMPTS.bee;
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });
    
    res.status(200).json({
      response: response.content[0].text
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response', details: error.message });
  }
};
