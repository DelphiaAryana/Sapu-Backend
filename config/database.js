import { Sequelize } from "sequelize";

const db = new Sequelize('sapu_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db;