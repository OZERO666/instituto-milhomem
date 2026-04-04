import nodemailer from 'nodemailer';
import logger from './logger.js';

// Transportador SMTP — configurado via variáveis de ambiente
const transport = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.hostinger.com',
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL na porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia um email.
 * @param {object} opts
 * @param {string} opts.to       - Destinatário(s), padrão: SMTP_TO env var
 * @param {string} opts.subject  - Assunto
 * @param {string} opts.html     - Corpo em HTML
 * @param {string} [opts.replyTo] - Email de reply-to (ex: email do cliente)
 */
export async function sendMail({ to, subject, html, replyTo }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP não configurado — email não enviado.');
    return;
  }

  try {
    await transport.sendMail({
      from:    `"Instituto Milhomem" <${process.env.SMTP_USER}>`,
      to:      to || process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: replyTo,
      subject,
      html,
    });
    logger.info(`Email enviado para: ${to || process.env.SMTP_TO}`);
  } catch (err) {
    // Log mas não lança — email falhar não deve derrubar a requisição
    logger.error('Erro ao enviar email:', err.message);
  }
}
