if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: {} };
} else if (!globalThis.process.env) {
  globalThis.process.env = {};
}

import { handler as groqHandler } from '../../netlify/functions/groq-proxy.js';

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions();
  }

  // Populate environment variables from Cloudflare Pages context.env into globalThis.process.env
  if (context.env) {
    for (const [key, value] of Object.entries(context.env)) {
      if (typeof value === 'string' && value) {
        globalThis.process.env[key] = value;
      }
    }
  }

  try {
    const bodyText = await context.request.text();
    const event = {
      httpMethod: context.request.method,
      body: bodyText
    };

    const res = await groqHandler(event);
    return new Response(res.body, {
      status: res.statusCode || 200,
      headers: res.headers || {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('[Cloudflare Pages groq-proxy] Error:', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'Realtime AI is unavailable right now. Please try again later.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
