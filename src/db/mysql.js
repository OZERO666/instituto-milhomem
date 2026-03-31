import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`❌ Variável de ambiente ausente: ${key}`);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 50,
  connectTimeout: 10000,
  charset: 'utf8mb4',
});

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL conectado com sucesso');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Falha ao conectar ao MySQL:', err.message);
    process.exit(1);
  });

export default pool;
