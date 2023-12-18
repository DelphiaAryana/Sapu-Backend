/* eslint-disable import/extensions */
import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import Users from './UserModel.js';
import Item from './ItemModel.js';

const { DataTypes } = Sequelize;

const Riwayat = db.define('riwayat', {
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
  id_item: {
    type: DataTypes.INTEGER,
    references: {
      model: Item,
      key: 'id',
    },
  },
  noHp: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  address: DataTypes.STRING,
  date: DataTypes.STRING,
  total: DataTypes.INTEGER,
}, {
  freezeTableName: true,
});

Riwayat.belongsTo(Users, { foreignKey: 'id_user' });
Riwayat.belongsTo(Item, { foreignKey: 'id_item' });

export default Riwayat;

(async () => {
  await db.sync();
})();
