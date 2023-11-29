import express from "express";
import dotenv from "dotenv";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();
const app = express();
try {
    await db.authenticate();
    console.log("Database Connected");
    await db.sync();
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials: true, origin:'http://127.0.0.1:5173'}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(4000, ()=> console.log("Server running at port 4000"));
