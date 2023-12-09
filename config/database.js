import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const db = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
});
export default db;
