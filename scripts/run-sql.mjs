import { readFileSync } from 'node:fs';

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obHFmd2ViYWNjeHZ0c2toZ2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTY3NjcwNCwiZXhwIjoyMTA1MjUyNzA0fQ.oBPJG5ypgpKAkD6OZuvMSiIkeojRCga70-wf9C_COB4';
const BASE = 'https://nhlqfwebaccxvtskhgkz.supabase.co';

async function run(sql) {
  const res = await fetch(`${BASE}/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error('SQL FAILED:', res.status, text.slice(0, 500));
    return false;
  }
  console.log('OK:', sql.trim().slice(0, 80).replace(/\s+/g, ' '));
  return true;
}

async function main() {
  const base = 'supabase';

  for (const file of ['setup-harbison.sql', 'phase1-finalization.sql']) {
    const sql = readFileSync(`${base}/${file}`, 'utf8');
    const stmts = sql.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'));
    for (const stmt of stmts) {
      const s = stmt.trim();
      if (!s) continue;
      if (!await run(s)) process.exit(1);
    }
  }
  console.log('All migrations complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
