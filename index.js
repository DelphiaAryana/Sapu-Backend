/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';
import db from './config/database.js';
import router from './routes/index.js';
import ItemRoute from './routes/ItemRoute.js';
import TransaksiRoute from './routes/TransaksiRoute.js';

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db,
});

try {
  await db.authenticate();
  console.log('Database Connected');
  await db.sync();
} catch (error) {
  console.error(error);
}

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    secure: 'auto',
  },
}));

app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173' }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));
app.use(router);
app.use(ItemRoute);
app.use(TransaksiRoute);

store.sync();

app.listen(process.env.APP_URL, () => console.log('Server running at port 4000'));
