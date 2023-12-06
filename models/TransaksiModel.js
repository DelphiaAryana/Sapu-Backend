import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js"; 
import Product from "./ItemModel.js"; 

const { DataTypes } = Sequelize;

const Transaksi = db.define('transaksi', {
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    id_item: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    noHp: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    address: DataTypes.STRING,
    total: DataTypes.INTEGER,
}, {
    freezeTableName: true
});

Transaksi.belongsTo(User, { foreignKey: 'id_user' });
Transaksi.belongsTo(Product, { foreignKey: 'id_item' });

export default Transaksi;

(async () => {
    await db.sync();
})();
