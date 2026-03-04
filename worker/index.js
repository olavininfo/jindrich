/**
 * Jindrich Contact Form API — Cloudflare Worker
 * Handles Turnstile verification + Resend email delivery
 */

export default {
    async fetch(request, env) {
        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders(request),
            });
        }

        if (request.method !== 'POST') {
            return jsonResponse({ success: false, error: 'Method not allowed' }, 405, request);
        }

        try {
            const body = await request.json();
            const { name, email, country, phone, message, turnstileToken, language } = body;

            // ── 1. Validate required fields ──
            if (!name || !email || !country || !phone || !message || !turnstileToken) {
                return jsonResponse({ success: false, error: 'Missing required fields' }, 400, request);
            }

            // ── 2. Server-side business email check ──
            const blockedDomains = [
                'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
                'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
                'protonmail.com', 'proton.me', 'qq.com', '163.com', '126.com', 'yeah.net',
                'sina.com', 'sina.cn', 'sohu.com', 'foxmail.com', '139.com', '189.cn',
                'mail.ru', 'yandex.com', 'yandex.ru', 'zoho.com', 'gmx.com', 'web.de',
                'naver.com', 'mail.com', 'email.com', 'tutanota.com', 'fastmail.com',
            ];
            const emailDomain = email.split('@')[1]?.toLowerCase();
            if (!emailDomain || blockedDomains.includes(emailDomain)) {
                return jsonResponse({ success: false, error: 'Business email required' }, 400, request);
            }

            // ── 3. Verify Turnstile token ──
            const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                    remoteip: request.headers.get('CF-Connecting-IP') || '',
                }),
            });

            const turnstileData = await turnstileResult.json();
            if (!turnstileData.success) {
                return jsonResponse({ success: false, error: 'Turnstile verification failed' }, 403, request);
            }

            // ── 4. Send email via Resend API ──
            const htmlBody = buildEmailHtml({ name, email, country, phone, message, language });

            const resendResult = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Jindrich Website <website@jindrich.com.cn>',
                    to: ['info@jindrich.com.cn'],
                    subject: `[Website Inquiry] ${name} — ${country}`,
                    html: htmlBody,
                    reply_to: email,
                }),
            });

            const resendData = await resendResult.json();

            if (!resendResult.ok) {
                console.error('Resend error:', JSON.stringify(resendData));
                return jsonResponse({ success: false, error: 'Email delivery failed' }, 500, request);
            }

            return jsonResponse({ success: true }, 200, request);

        } catch (err) {
            console.error('Worker error:', err.message);
            return jsonResponse({ success: false, error: 'Internal server error' }, 500, request);
        }
    },
};

/**
 * Build a professional HTML email template
 */
function buildEmailHtml({ name, email, country, phone, message, language }) {
    const langLabel = language === 'zh' ? '中文' : 'English';
    return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 32px;">
      <div style="background: #221714; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">📩 New Inquiry from Jindrich Website</h1>
      </div>
      <div style="background: #fff; padding: 32px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #888; width: 120px; font-size: 14px;">Name</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 14px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Email</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #c81d1d;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Country</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${escapeHtml(country)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Phone</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 14px;">Language</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${langLabel}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 20px; background: #fafafa; border-radius: 6px; border-left: 3px solid #c81d1d;">
          <p style="margin: 0 0 8px 0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #bbb; text-align: center;">Sent from jindrich.com.cn contact form</p>
      </div>
    </div>
  `;
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * JSON response helper with CORS
 */
function jsonResponse(data, status, request) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request),
        },
    });
}

/**
 * CORS headers
 */
function corsHeaders(request) {
    const origin = request?.headers?.get('Origin') || '*';
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };
}
