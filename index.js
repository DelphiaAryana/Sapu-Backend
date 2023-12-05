import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/database.js';
import router from './routes/index.js';
import FileUpload from "express-fileupload";
import ItemRoute from "./routes/ItemRoute.js";

dotenv.config();
const app = express();
try {
  await db.authenticate();
  console.log('Database Connected');
  await db.sync();
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173' }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(router);
app.use(ItemRoute);

app.listen(4000, () => console.log('Server running at port 4000'));
