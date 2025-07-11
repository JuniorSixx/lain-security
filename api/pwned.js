export default async function handler(req, res) {
  const { prefix } = req.query;
  if (!prefix || typeof prefix !== 'string' || prefix.length !== 5) {
    return res.status(400).json({ error: 'Prefixo SHA-1 inválido' });
  }

  try {
    const hibpRes = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!hibpRes.ok) {
      return res.status(hibpRes.status).json({ error: 'Erro na API HIBP' });
    }
    const text = await hibpRes.text();
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao consultar HIBP' });
  }
} 