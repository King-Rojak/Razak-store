// Local/deployment test endpoint. Protected by TEST_ENDPOINT_KEY.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!process.env.TEST_ENDPOINT_KEY || req.headers["x-test-key"] !== process.env.TEST_ENDPOINT_KEY) {
    return res.status(401).json({ ok: false, error: "Invalid test key" });
  }
  const sample = {
    event_id: `test_${Date.now()}`,
    source: "manual_test",
    payload: req.body || { message: "RAZAK STORE webhook test" },
    received_at: new Date().toISOString()
  };
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/webhook_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(sample)
    });
    if (!r.ok) return res.status(500).json({ ok: false, error: await r.text() });
  }
  return res.status(200).json({ ok: true, sample });
};
