const KEY = "hs_sid";

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function readCookie() {
  const match = document.cookie.split("; ").find((row) => row.startsWith(KEY + "="));
  return match ? match.split("=")[1] : null;
}

export function getSessionId() {
  const existing = readCookie();
  if (existing) return existing;
  const sid = uuid();
  document.cookie = `${KEY}=${sid}; path=/; max-age=31536000; SameSite=Lax`;
  return sid;
}

export function trackPageView(path) {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const sid = getSessionId();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId: sid,
        path,
        referrer: document.referrer,
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
        utmTerm: params.get("utm_term") || undefined,
        utmContent: params.get("utm_content") || undefined,
      }),
    }).catch(() => {});
  } catch {
    // Tracking is best-effort and must never break the page.
  }
}