import { Sequelize } from 'sequelize';

const db = new Sequelize('sapu_db', 'root', '', {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});
export default db;
