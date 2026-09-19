// Cloudflare Pages Function: /api/ai-insight
const rateMap = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return true; // Direct/same-origin requests have empty Origin header
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    // Allow afriwidget production domain, pages.dev previews, run.app dev previews, and localhost
    return (
      host === 'afriwidget.com' ||
      host.endsWith('.afriwidget.com') ||
      host.endsWith('.pages.dev') ||
      host.endsWith('.run.app') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

function getCorsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? (origin || 'https://afriwidget.com') : 'https://afriwidget.com';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  });
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Only reject if origin is present and explicitly unauthorized
    if (origin && !isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    // Rate limiting: 30 requests per minute per visitor IP
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const visitor = rateMap.get(ip) || { count: 0, reset: now + 60000 };
    if (now > visitor.reset) {
      visitor.count = 0;
      visitor.reset = now + 60000;
    }
    visitor.count++;
    rateMap.set(ip, visitor);
    if (rateMap.size > 5000) rateMap.clear();

    if (visitor.count > 30) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429, headers: corsHeaders });
    }

    const body = await request.json().catch(() => ({}));
    const promptText = (typeof body === 'object' && body !== null)
      ? (body.prompt || body.message || body.input || JSON.stringify(body))
      : String(body);

    if (!promptText || promptText.trim() === '{}') {
      return new Response(JSON.stringify({ error: 'No input provided' }), { status: 400, headers: corsHeaders });
    }

    // Gather all GROQ keys from context.env as well as global process.env if available
    const envSource = Object.assign({}, (typeof process !== 'undefined' && process.env) || {}, env);
    const keys = [];
    let i = 1;
    while (envSource[`GROQ_API_KEY_${i}`]) {
      const keyVal = envSource[`GROQ_API_KEY_${i}`].trim();
      if (keyVal) keys.push(keyVal);
      i++;
    }
    if (envSource.GROQ_API_KEY) {
      const singleKey = envSource.GROQ_API_KEY.trim();
      if (singleKey && !keys.includes(singleKey)) {
        keys.push(singleKey);
      }
    }

    if (keys.length === 0) {
      return new Response(JSON.stringify({ error: 'No API keys configured' }), { status: 500, headers: corsHeaders });
    }

    const systemPrompt = 'Reply in plain English, one or two sentences, maximum 500 characters. Specific to the actual numbers sent by the user, never generic. Explain what the numbers mean clearly. No greetings, no lists, no bullet points, no emoji. Never give medical, legal, or financial advice.';
    
    // Robust models list in order of preference: highly available Groq models with fallback
    const candidateModels = [
      'groq/compound-mini',
      'qwen/qwen3.8-27b',
      'groq/compound',
      'openai/gpt-oss-120b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant'
    ];

    let insight = null;

    // Try keys and models gracefully
    for (const key of keys) {
      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: String(promptText).slice(0, 1000) }
              ],
              max_tokens: 140,
              temperature: 0.25
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const text = data?.choices?.[0]?.message?.content?.trim();
            if (text) {
              insight = text.slice(0, 500);
              break;
            }
          } else if (res.status === 404 || res.status === 400) {
            // Model doesn't exist or is unavailable on this tier, try next model immediately
            continue;
          } else if (res.status === 401) {
            // Invalid key, break to next key
            break;
          }
        } catch {
          // Move to next candidate on timeout or network error
        }
      }

      if (insight) break;
    }

    if (insight) {
      return new Response(JSON.stringify({ insight: insight }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Service currently busy. Please try again shortly.' }), { status: 503, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: corsHeaders });
  }
}
