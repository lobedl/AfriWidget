import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handler as groqHandler } from './netlify/functions/groq-proxy.js';
import { handler as sendEmailHandler } from './netlify/functions/send-email.js';
import { onRequestPost as aiInsightPost, onRequestOptions as aiInsightOptions } from './functions/api/ai-insight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Handle Netlify function calls locally
async function handleNetlifyFunction(req, res) {
  try {
    const event = {
      httpMethod: req.method,
      body: JSON.stringify(req.body)
    };
    const response = await groqHandler(event);
    res.status(response.statusCode || 200);
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, val]) => {
        res.setHeader(key, val);
      });
    }
    res.send(response.body);
  } catch (err) {
    console.error('Error invoking Netlify function:', err);
    res.status(500).json({ error: 'Internal Function Error' });
  }
}

async function handleSendEmailFunction(req, res) {
  try {
    const event = {
      httpMethod: req.method,
      body: JSON.stringify(req.body)
    };
    const response = await sendEmailHandler(event);
    res.status(response.statusCode || 200);
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, val]) => {
        res.setHeader(key, val);
      });
    }
    res.send(response.body);
  } catch (err) {
    console.error('Error invoking send-email function:', err);
    res.status(500).json({ error: 'Internal Function Error' });
  }
}

app.all('/.netlify/functions/groq-proxy', handleNetlifyFunction);
app.all('/.netlify/functions/education-ai', handleNetlifyFunction);
app.all('/api/groq-proxy', handleNetlifyFunction);
app.all('/api/education-ai', handleNetlifyFunction);

app.all('/.netlify/functions/send-email', handleSendEmailFunction);
app.all('/api/send-email', handleSendEmailFunction);

// Cloudflare Pages /api/ai-insight handler for local dev server
app.options('/api/ai-insight', async (req, res) => {
  try {
    const context = {
      request: new Request('http://localhost:3000/api/ai-insight', {
        method: 'OPTIONS',
        headers: req.headers
      }),
      env: process.env
    };
    const response = await aiInsightOptions(context);
    res.status(response.status);
    response.headers.forEach((val, key) => res.setHeader(key, val));
    res.end();
  } catch (err) {
    console.error('Error in /api/ai-insight OPTIONS:', err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

app.post('/api/ai-insight', async (req, res) => {
  try {
    const origin = req.headers.origin || `http://${req.headers.host || 'localhost:3000'}`;
    const context = {
      request: new Request('http://localhost:3000/api/ai-insight', {
        method: 'POST',
        headers: {
          ...req.headers,
          'origin': req.headers.origin || origin
        },
        body: JSON.stringify(req.body)
      }),
      env: process.env
    };
    const response = await aiInsightPost(context);
    res.status(response.status);
    response.headers.forEach((val, key) => res.setHeader(key, val));
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error('Error invoking ai-insight:', err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

// 301 Redirects from _redirects
try {
  const redirectsContent = fs.readFileSync(path.join(__dirname, '_redirects'), 'utf8');
  redirectsContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const [from, to, code] = parts;
        const statusCode = parseInt(code, 10) || 301;
        if (statusCode === 301 || statusCode === 302) {
          app.get(from, (req, res) => res.redirect(statusCode, to));
        }
      }
    }
  });
} catch (err) {
  console.error('Error loading _redirects:', err);
}

// Serve static files with html extension fallback
app.use(express.static(__dirname, { extensions: ['html'] }));

// Clean URL routing fallback for HTML pages (e.g. /bmi-calculator -> /bmi-calculator.html)
app.use((req, res, next) => {
  if (req.method === 'GET' && !path.extname(req.path)) {
    const filePath = path.join(__dirname, req.path + '.html');
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

// Fallback 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'), (err) => {
    if (err) {
      res.status(404).send('404 Not Found');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AfriWidget server running on http://0.0.0.0:${PORT}`);
});
