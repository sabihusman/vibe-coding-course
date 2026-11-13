// Vercel serverless function: GET /api/supabase-config
// Returns the Supabase project URL and the public (anon) key from Vercel environment
// variables, so neither is stored in the repo. The anon key is meant for browsers;
// row-level security in the database decides what each signed-in rep can read or write.
// Never put the service_role key here.
module.exports = function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !anonKey) {
    res.statusCode = 204; // not configured: the app falls back to its in-page sample data
    return res.end();
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ url, anonKey }));
};
