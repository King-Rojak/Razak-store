// SociaBuzz SHOP webhook receiver — TESTING SCAFFOLD
// IMPORTANT: confirm the exact auth header and payload format with SociaBuzz.
// This endpoint stores the raw event. It deliberately does NOT mark an order paid.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const expected = process.env.SOCIABUZZ_WEBHOOK_TOKEN;
  if (!expected) return res.status(503).json({ ok: false, error: "Webhook token is not configured" });

  // Header name is configurable because SociaBuzz's SHOP article does not document it.
  const headerName = (process.env.SOCIABUZZ_TOKEN_HEADER || "x-webhook-token").toLowerCase();
  const received = req.headers[headerName];
  if (!received || received !== expected) {
    return res.status(401).json({ ok: false, error: "Invalid webhook token" });
  }

  const payload = req.body || {};
  const eventId = String(payload.transaction_id || payload.id || `evt_${Date.now()}`);
  const record = {
    event_id: eventId,
    source: "sociabuzz_shop",
    payload,
    received_at: new Date().toISOString()
  };

  // Optional persistence via Supabase REST API.
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/webhook_events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "resolution=ignore-duplicates,return=minimal"
        },
        body: JSON.stringify(record)
      });
      if (!r.ok) {
        const detail = await r.text();
        return res.status(500).json({ ok: false, error: "Could not save webhook event", detail });
      }
    } catch (e) {
      return res.status(500).json({ ok: false, error: "Webhook storage failed" });
    }
  }

  return res.status(200).json({ ok: true, received: true, stored: Boolean(process.env.SUPABASE_URL) });
};
