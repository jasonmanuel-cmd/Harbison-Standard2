import { buyerDetail } from './lib/buyer-crm.mjs';
import { isAdmin, json } from './lib/auth.mjs';
import leadsHandler from './leads.mjs';

async function handler(request) {
  const method = request.method;

  if (method === 'GET') {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    return await buyerDetail(request);
  }

  if (method === 'PATCH') {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    return await buyerDetail(request);
  }

  if (method === 'POST') {
    return await leadsHandler.fetch(request);
  }

  return json({ error: 'Method not allowed' }, { status: 405 });
}

export default { fetch: handler };
