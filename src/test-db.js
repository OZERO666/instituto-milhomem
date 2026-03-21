import pool from './db/mysql.js';

const test = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    console.log('Conexão OK, resultado:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao conectar no MySQL:', err);
    process.exit(1);
  }
};

test();