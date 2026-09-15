import {supabaseConfigured} from './lib/supabase.mjs';
import {buyerList} from './lib/buyer-crm.mjs';
import {json, isAdmin} from './lib/auth.mjs';

async function handler(request) {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });
  try {
    if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseConfigured()) return json({ error: "Supabase not configured" }, { status: 503 });
    return await buyerList(request);
  } catch (err) {
    console.error("[leads list error]", err);
    return json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}

// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
