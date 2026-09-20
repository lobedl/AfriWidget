// Cloudflare Pages Function: /api/ai-insight
// AfriWidget AI Insight Interpretation Engine
import {
  normalizeToolContext,
  buildSystemPrompt,
  buildUserPrompt,
  generateDeterministicInsight,
  clampInsightLength
} from './ai-insight-engine.js';

const rateMap = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour (3,600,000 ms)

function isAllowedOrigin(origin) {
  if (!origin) return true; // Direct/same-origin requests have empty Origin header
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
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

function cleanText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText;
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  text = text.replace(/<think>[\s\S]*$/gi, '');
  text = text.replace(/<\/think>/gi, '');
  text = text.replace(/^(Here'?s (a|the) (thinking process|rationale|analysis):?[\s\S]*?\n\n)/i, '');
  return text.trim();
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  try {
    if (origin && !isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    // Rate limiting: 5 requests per hour per IP
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const visitor = rateMap.get(ip) || { count: 0, reset: now + RATE_LIMIT_WINDOW_MS };
    if (now > visitor.reset) {
      visitor.count = 0;
      visitor.reset = now + RATE_LIMIT_WINDOW_MS;
    }
    visitor.count++;
    rateMap.set(ip, visitor);
    if (rateMap.size > 5000) rateMap.clear();

    if (visitor.count > RATE_LIMIT_MAX) {
      const retryAfterSec = Math.max(1, Math.ceil((visitor.reset - now) / 1000));
      const retryMinutes = Math.ceil(retryAfterSec / 60);
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit reached: maximum 5 requests per hour. Please try again in ${retryMinutes} minute${retryMinutes === 1 ? '' : 's'}.`,
          insight: `Rate limit reached: you have reached the limit of 5 requests per hour. Please wait ${retryMinutes} minute${retryMinutes === 1 ? '' : 's'} before requesting another AI insight.`,
          rateLimit: RATE_LIMIT_MAX,
          rateLimitWindow: '1 hour',
          retryAfter: retryAfterSec
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': String(retryAfterSec)
          }
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const headersObj = {};
    if (request.headers && typeof request.headers.forEach === 'function') {
      request.headers.forEach((v, k) => { headersObj[k] = v; });
    } else if (request.headers && typeof request.headers.get === 'function') {
      headersObj.referer = request.headers.get('referer') || request.headers.get('Referer') || '';
    }

    // Normalize tool context & evaluate against authoritative benchmarks
    const toolCtx = normalizeToolContext(body, headersObj);
    const systemPrompt = buildSystemPrompt(toolCtx);
    const userPrompt = buildUserPrompt(toolCtx);

    const envSource = Object.assign({}, (typeof process !== 'undefined' && process.env) || {}, env);
    
    // Gather Groq keys
    const groqKeys = [];
    let i = 1;
    while (envSource[`GROQ_API_KEY_${i}`]) {
      const keyVal = envSource[`GROQ_API_KEY_${i}`].trim();
      if (keyVal) groqKeys.push(keyVal);
      i++;
    }
    if (envSource.GROQ_API_KEY) {
      const singleKey = envSource.GROQ_API_KEY.trim();
      if (singleKey && !groqKeys.includes(singleKey)) {
        groqKeys.push(singleKey);
      }
    }

    const geminiKey = envSource.GEMINI_API_KEY || envSource.API_KEY || '';

    const candidateGroqModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'qwen/qwen3.8-27b',
      'groq/compound',
      'openai/gpt-oss-120b'
    ];

    let insight = null;

    // 1. Try Groq API
    if (groqKeys.length > 0) {
      for (const key of groqKeys) {
        for (const model of candidateGroqModels) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

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
                  { role: 'user', content: userPrompt }
                ],
                max_tokens: 180,
                temperature: 0.2
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const text = cleanText(data?.choices?.[0]?.message?.content);
              if (text && text.length > 50) {
                insight = text;
                break;
              }
            } else if (res.status === 401) {
              break; // Key invalid, skip to next key
            }
          } catch {
            // Next model on timeout or network error
          }
        }
        if (insight) break;
      }
    }

    // 2. Fallback to Gemini if Groq did not return an insight
    if (!insight && geminiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 180
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text = cleanText(data?.candidates?.[0]?.content?.parts?.[0]?.text);
          if (text && text.length > 50) {
            insight = text;
          }
        }
      } catch (err) {
        console.warn('Gemini fallback attempt failed:', err?.message || err);
      }
    }

    // 3. Fallback to Deterministic Benchmark Interpretation (Guarantees 100% reliability with verified sources)
    if (!insight) {
      insight = generateDeterministicInsight(toolCtx);
    }

    // Strictly enforce range of 300 to 500 characters max
    insight = clampInsightLength(insight, 300, 500, toolCtx);

    return new Response(
      JSON.stringify({
        insight: insight,
        tool: toolCtx.toolSlug,
        source: toolCtx.source,
        sourceUrl: toolCtx.sourceUrl
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (err) {
    console.error('Error handling AI insight:', err);
    // Fallback on unexpected server error: return deterministic insight rather than breaking
    try {
      const toolCtx = normalizeToolContext({}, {});
      const fallbackInsight = clampInsightLength(generateDeterministicInsight(toolCtx), 300, 500, toolCtx);
      return new Response(JSON.stringify({ insight: fallbackInsight }), { status: 200, headers: corsHeaders });
    } catch {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: corsHeaders });
    }
  }
}
