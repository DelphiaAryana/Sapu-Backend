/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import FileUpload from 'express-fileupload';
import db from './config/database.js';
import router from './routes/index.js';
import ItemRoute from './routes/ItemRoute.js';
import cloudinary from './config/cloudinary.js';
import Item from './models/ItemModel.js';
import TransaksiRoute from './routes/TransaksiRoute.js';

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log('Database Connected');
  await db.sync();
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: 'https://sapu-akhmad-sugiannooors-projects.vercel.app' }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));
app.use(router);
app.use(ItemRoute);
// Endpoint untuk membuat item baru
app.post('/createItem', async (req, res) => {
  try {
    // Ambil data dari request body
    const {
      name, description, price, url, imageBase64,
    } = req.body;

    // Upload gambar ke Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'items', // Sesuaikan dengan folder di Cloudinary
    });

    // Simpan item ke database
    const newItem = await Item.create({
      name,
      description,
      price,
      url,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.use(TransaksiRoute);

app.listen(process.env.APP_URL, () => console.log('Server running at port 4000'));
