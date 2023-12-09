import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const db = new Sequelize({
  database: 'bzzt4lortqptla9xotfm',
  username: 'umdjjxf57nugao03',
  password: '9BhhUjjHMXHNtietC1yO',
  host: 'bzzt4lortqptla9xotfm-mysql.services.clever-cloud.com',
  dialect: 'mysql',
  dialectModule: mysql2,
});
export default db;
