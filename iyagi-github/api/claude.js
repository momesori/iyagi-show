export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(500).json({ error: { message: 'API 키 없음' } }); return; }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: req.body.model || 'claude-sonnet-4-6', max_tokens: req.body.max_tokens || 1500, messages: req.body.messages }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) { res.status(500).json({ error: { message: e.message } }); }
}
