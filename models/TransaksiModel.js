import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Transaksi = db.define('transaksi', {
    name: DataTypes.STRING,
    item: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    address: DataTypes.STRING,
    date: DataTypes.STRING,
    total: DataTypes.INTEGER,
}, {
    freezeTableName: true
});

export default Transaksi;

(async()=>{
    await db.sync();
})();