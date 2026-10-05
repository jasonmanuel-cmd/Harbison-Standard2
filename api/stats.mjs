import { buyerStats } from './lib/buyer-crm.mjs';
import { isAdmin, json } from './lib/auth.mjs';

async function handler(request) {
  if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return await buyerStats();
  } catch (err) {
    console.error('[stats error]', err);
    return json({ error: 'Failed to load stats' }, { status: 500 });
  }
}

export default { fetch: handler };
