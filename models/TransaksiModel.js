import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Transaksi = db.define('transaksi', {
    id_user: DataTypes.INTEGER,
    id_item: DataTypes.INTEGER,
    noHp: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    address: DataTypes.STRING,
    date: DataTypes.DATE,
    total: DataTypes.INTEGER,
}, {
    freezeTableName: true
});

export default Transaksi;

(async()=>{
    await db.sync();
})();