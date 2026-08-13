import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler as groqHandler } from './netlify/functions/groq-proxy.js';
import { handler as sendEmailHandler } from './netlify/functions/send-email.js';

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

// 301 Redirects from _redirects
app.get(['/tech-tool.html', '/tech-tools.html', '/tech-tool', '/tech-tools'], (req, res) => {
  res.redirect(301, '/productivity');
});

import fs from 'fs';

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
