import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/checkPermission.js';
import logger from '../utils/logger.js';
import { sendMail } from '../utils/mailer.js';

const router = Router();

router.get('/', authMiddleware, checkPermission('leads', 'read'), async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM agendamentos ORDER BY created DESC');
    res.json(rows);
  } catch (error) {
    logger.error('Agendamentos GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, tipo_servico, mensagem } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'nome, email e telefone são obrigatórios' });
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    const id = uuidv4(); // ← gerado pelo servidor, não pelo cliente
    const now = new Date();

    await pool.execute(
      'INSERT INTO agendamentos (id, nome, email, telefone, tipo_servico, mensagem, lido, created, updated) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)',
      [id, nome, email, telefone, tipo_servico || null, mensagem || null, now, now]
    );

    logger.info(`Novo agendamento recebido: ${nome} (${email})`);

    // Notificação por email (não-bloqueante)
    sendMail({
      subject: `📋 Novo contato — ${nome}`,
      replyTo: email,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#B8860B;border-bottom:2px solid #B8860B;padding-bottom:8px">
            Novo contato recebido
          </h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;width:140px">Nome:</td><td style="padding:8px">${nome}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Telefone:</td><td style="padding:8px">${telefone}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Serviço:</td><td style="padding:8px">${tipo_servico || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mensagem:</td><td style="padding:8px;white-space:pre-wrap">${mensagem || '—'}</td></tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#666">
            Recebido em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            · <a href="${process.env.SITE_URL || 'https://institutomilhomem.com'}/admin">Ver no painel</a>
          </p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Agendamento recebido com sucesso' });
  } catch (error) {
    logger.error('Agendamentos POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, checkPermission('leads', 'update'), async (req, res) => {
  try {
    const { lido } = req.body;

    const [result] = await pool.execute(
      'UPDATE agendamentos SET lido=?, updated=? WHERE id=?',
      [lido ? 1 : 0, new Date(), req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Agendamentos PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, checkPermission('leads', 'delete'), async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM agendamentos WHERE id=?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    logger.error('Agendamentos DELETE error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
