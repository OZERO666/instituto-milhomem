import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'u987109917_imilh',
  password: process.env.DB_PASSWORD || '6j858haDL8>O',
  database: process.env.DB_NAME || 'u987109917_imilh',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
