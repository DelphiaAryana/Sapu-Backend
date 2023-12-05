import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const { DataTypes } = Sequelize;

const Users = db.define('users', {
  name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  freezeTableName: true,
});

export default Users;
