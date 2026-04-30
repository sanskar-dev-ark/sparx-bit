import { Router } from 'express'
import { firebaseAdmin } from '../firebaseAdmin.js'

const router = Router()

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function magicLinkTemplate({ email, link }) {
  const safeEmail = escapeHtml(email)
  const safeLink = escapeHtml(link)

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Sparx Bit sign-in link</title>
  </head>
  <body style="margin:0;background:#F7F7FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1A1A2E;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F7FA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 32px rgba(26,26,46,0.08);">
            <tr>
              <td style="padding:32px 32px 24px;background:linear-gradient(135deg,#6B8DD6,#6ECFB0);color:#ffffff;">
                <div style="width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,0.22);display:inline-flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;">✦</div>
                <h1 style="margin:20px 0 8px;font-size:28px;line-height:1.15;font-weight:900;">Sign in to Sparx Bit</h1>
                <p style="margin:0;font-size:15px;line-height:1.6;opacity:0.9;">One secure tap to get back to building your habits.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">We received a request to sign in as <strong>${safeEmail}</strong>.</p>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#6B7280;">This magic link is private and should only be used by you. It will expire automatically.</p>
                <a href="${safeLink}" style="display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,#6B8DD6,#6ECFB0);color:#ffffff;font-weight:800;font-size:16px;padding:16px 22px;border-radius:16px;">Continue to Sparx Bit</a>
                <p style="margin:28px 0 8px;font-size:13px;line-height:1.6;color:#6B7280;">If the button does not work, paste this link into your browser:</p>
                <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;color:#6B8DD6;">${safeLink}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#F7F7FA;color:#6B7280;font-size:12px;line-height:1.6;">
                If you did not request this email, you can safely ignore it.
                <br>Sparx Bit · Small habits, visible progress.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) return { skipped: true }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.AUTH_EMAIL_FROM || 'Sparx Bit <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to send email')
  }
  return data
}

router.post('/magic-link', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const link = await firebaseAdmin.auth().generateSignInWithEmailLink(email, {
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`,
      handleCodeInApp: true,
    })
    const result = await sendEmail({
      to: email,
      subject: 'Your Sparx Bit sign-in link',
      html: magicLinkTemplate({ email, link }),
    })

    if (result.skipped) {
      console.info('[magic-link dev]', { email, link })
      return res.json({ ok: true, devLink: process.env.NODE_ENV === 'production' ? undefined : link })
    }

    res.json({ ok: true })
  } catch (error) {
    console.error('[magic-link error]', {
      message: error.message,
      code: error.code,
    })
    res.status(500).json({ error: error.message || 'Failed to send magic link' })
  }
})

export default router
