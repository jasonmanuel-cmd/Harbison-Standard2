import { readFileSync } from 'node:fs';
import { Client } from 'pg';

const conn = 'postgresql://postgres:[q:.he8#@dSfZqn#]@db.nhlqfwebaccxvtskhgkz.supabase.co:5432/postgres';

async function run() {
  const client = new Client(conn);
  await client.connect();
  console.log('Connected OK');

  const sql = readFileSync('supabase/setup-harbison.sql', 'utf8');
  const stmts = sql.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'));
  for (const stmt of stmts) {
    const s = stmt.trim();
    if (!s) continue;
    try {
      await client.query(s);
      console.log('OK:', s.slice(0, 70).replace(/\s+/g, ' '));
    } catch (e) {
      console.error('FAIL:', s.slice(0, 70), e.message);
    }
  }

  const sql2 = readFileSync('supabase/phase1-finalization.sql', 'utf8');
  const stmts2 = sql2.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'));
  for (const stmt of stmts2) {
    const s = stmt.trim();
    if (!s) continue;
    try {
      await client.query(s);
      console.log('OK:', s.slice(0, 70).replace(/\s+/g, ' '));
    } catch (e) {
      console.error('FAIL:', s.slice(0, 70), e.message);
    }
  }

  await client.end();
  console.log('DONE');
}

run().catch(e => { console.error(e); process.exit(1); });
