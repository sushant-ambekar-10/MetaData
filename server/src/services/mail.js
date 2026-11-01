import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { escapeHtml } from '../utils/escapeHtml.js';

let transporter;
const getTransporter = () =>
  (transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  }));

export async function sendContactMail({ name, email, message }) {
  const safeName = name.replace(/[\r\n]+/g, ' '); // prevent header injection
  const subject = `Portfolio contact: ${safeName}`;
  const text = `From: ${safeName} <${email}>\n\n${message}`;
  const html = `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  if (env.MAIL_PROVIDER === 'resend') {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [env.CONTACT_TO], reply_to: email, subject, text, html }),
    });
    if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
    return;
  }

  if (env.MAIL_PROVIDER === 'smtp') {
    await getTransporter().sendMail({ from: env.MAIL_FROM, to: env.CONTACT_TO, replyTo: email, subject, text, html });
    return;
  }

  console.log(`[mail:console] ${subject}\n${text}`); // dev fallback
}