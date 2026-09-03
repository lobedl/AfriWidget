if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: {} };
} else if (!globalThis.process.env) {
  globalThis.process.env = {};
}

import { onRequest as groqProxyHandler, onRequestOptions as groqOptionsHandler } from './api/groq-proxy.js';
import { onRequest as sendEmailHandler, onRequestOptions as sendEmailOptionsHandler } from './api/send-email.js';

/**
 * Cloudflare Pages Middleware
 * Handles legacy Netlify function paths (/.netlify/functions/*) with direct in-memory execution,
 * providing zero-overhead backward compatibility across all client scripts.
 */
export async function onRequestOptions(context) {
  const url = new URL(context.request.url);
  if (url.pathname === '/.netlify/functions/groq-proxy' || url.pathname === '/.netlify/functions/education-ai') {
    return groqOptionsHandler(context);
  }
  if (url.pathname === '/.netlify/functions/send-email') {
    return sendEmailOptionsHandler(context);
  }
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
  });
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }

  const url = new URL(context.request.url);

  // Direct dispatch for legacy Netlify function paths
  if (url.pathname === '/.netlify/functions/groq-proxy' || url.pathname === '/.netlify/functions/education-ai') {
    return groqProxyHandler(context);
  }
  if (url.pathname === '/.netlify/functions/send-email') {
    return sendEmailHandler(context);
  }

  return context.next();
}

