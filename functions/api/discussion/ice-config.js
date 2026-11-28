if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: {} };
} else if (!globalThis.process.env) {
  globalThis.process.env = {};
}

const DEFAULT_STUN_URLS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302'
];

export async function onRequestGet(context) {
  const env = (context && context.env) || process.env || {};
  const iceServers = [];

  const stunEnv = String(env.STUN_URLS || '').trim();
  const stunUrls = stunEnv
    ? stunEnv.split(',').map((u) => u.trim()).filter((u) => /^stuns?:[^\s]+$/i.test(u))
    : DEFAULT_STUN_URLS;

  if (stunUrls.length > 0) {
    iceServers.push({ urls: stunUrls });
  }

  const turnEnv = String(env.TURN_URLS || '').trim();
  const turnUrls = turnEnv
    ? turnEnv.split(',').map((u) => u.trim()).filter((u) => /^turns?:[^\s]+$/i.test(u))
    : [];

  let turnConfigured = false;
  if (turnUrls.length > 0) {
    const turnEntry = { urls: turnUrls };
    const turnUser = String(env.TURN_USERNAME || '').trim();
    const turnCred = String(env.TURN_CREDENTIAL || '').trim();
    if (turnUser && turnCred) {
      turnEntry.username = turnUser;
      turnEntry.credential = turnCred;
    }
    iceServers.push(turnEntry);
    turnConfigured = true;
  }

  const wsOverride = String(env.DISCUSSION_WS_URL || '').trim();
  const body = JSON.stringify({
    iceServers,
    turnConfigured,
    wsUrl: /^wss?:\/\/[^\s]+$/i.test(wsOverride) ? wsOverride : null
  });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}
