import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Item = db.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    url: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default Item;

(async()=>{
    await db.sync();
})();