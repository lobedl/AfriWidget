import { Resend } from 'resend';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, message: 'Method not allowed' });
  }

  let apiKey = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || '').trim();
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim();

  if (!apiKey) {
    console.warn('[send-email] RESEND_API_KEY environment variable is not configured.');
    return jsonResponse(200, {
      ok: false,
      message: 'Resend API key is not configured. Please add RESEND_API_KEY in your environment/Netlify settings.'
    });
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
  } catch {
    return jsonResponse(400, { ok: false, message: 'Invalid JSON payload.' });
  }

  const { firstName = '', lastName = '', email = '', subject = '', country = '', message = '' } = body;

  if (!email || !message) {
    return jsonResponse(400, { ok: false, message: 'Email and Message are required fields.' });
  }

  const resend = new Resend(apiKey);
  
  // Default to verified domain sender and primary inbox
  let toEmail = (process.env.CONTACT_EMAIL || process.env.RESEND_TO_EMAIL || '').trim().replace(/^["']|["']$/g, '');
  if (!toEmail) {
    toEmail = 'hello@afriwidget.com';
  }

  let fromEmail = (process.env.RESEND_FROM_EMAIL || '').trim().replace(/^["']|["']$/g, '');
  // If no fromEmail is specified or if it's set to the test onboarding sandbox, use the verified domain sender
  if (!fromEmail || fromEmail.includes('onboarding@resend.dev')) {
    fromEmail = 'AfriWidget Contact <contact@afriwidget.com>';
  }

  try {
    const payload = {
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[AfriWidget Contact] ${subject || 'General Inquiry'} - ${firstName} ${lastName}`.trim(),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f766e; margin-top: 0; font-size: 20px; font-weight: 800;">New Message from AfriWidget Contact Form</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #475569; width: 100px;">Name:</td>
              <td style="padding: 6px 0; color: #0f172a;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #475569;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #0f766e; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #475569;">Country:</td>
              <td style="padding: 6px 0; color: #0f172a;">${country || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #475569;">Subject:</td>
              <td style="padding: 6px 0; color: #0f172a;">${subject || 'General Inquiry'}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
          <p style="font-weight: 600; color: #475569; margin-bottom: 8px;">Message:</p>
          <div style="white-space: pre-wrap; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.6; font-size: 14px;">${message}</div>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0 12px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Sent automatically from the AfriWidget Website Contact Form</p>
        </div>
      `
    };

    let response = await resend.emails.send(payload);

    // Fallback: If for any reason the primary destination is blocked, retry to backup account
    if (response.error && response.error.name === 'validation_error' && typeof response.error.message === 'string') {
      const match = response.error.message.match(/\(([^)]+@[^)]+)\)/);
      if (match && match[1] && match[1] !== toEmail) {
        console.log(`[send-email] Retrying dispatch to verified recipient: ${match[1]}`);
        payload.to = [match[1]];
        response = await resend.emails.send(payload);
      }
    }

    if (response.error) {
      console.error('[send-email] Resend API error response:', response.error);
      const errMsg = response.error.message || 'Resend rejected the email request.';
      return jsonResponse(400, {
        ok: false,
        message: errMsg,
        details: response.error
      });
    }

    return jsonResponse(200, { ok: true, data: response.data });
  } catch (err) {
    console.error('[send-email] Resend error exception:', err);
    return jsonResponse(500, { ok: false, message: err?.message || 'Error delivering email via Resend' });
  }
};

export default handler;
