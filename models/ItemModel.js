/* eslint-disable import/extensions */
// models/item.js
import Sequelize from 'sequelize';
import db from '../config/database.js'; // Pastikan sesuaikan dengan konfigurasi proyek Anda

const Item = db.define('Item', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default Item;
