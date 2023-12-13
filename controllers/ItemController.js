/* eslint-disable import/no-import-module-exports */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import cloudinary from '../config/cloudinary.js';
import Item from '../models/ItemModel.js';
import upload from '../middleware/multer.js';

export const getItems = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    let queryOptions = {};

    if (searchQuery) {
      queryOptions = {
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchQuery}%` } },
          ],
        },
      };
    }

    const items = await Item.findAll(queryOptions);
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const response = await Item.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveItem = async (req, res) => {
  // Gunakan middleware multer untuk menangani unggah file
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ msg: 'Error mengunggah file' });
    }

    const name = req.body.title;
    const { file } = req; // Ganti req.files menjadi req.file
    const fileSize = file.size; // Ganti file.data.length menjadi file.size
    const ext = path.extname(file.originalname);
    const fileName = file.filename; // Ganti file.md5 + ext menjadi file.filename
    const url = `https://sapu-backend-mu.vercel.app/images/${fileName}`;
    const { description, price } = req.body;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({
        msg: 'Invalid Images',
      });
    }
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

    cloudinary.uploader.upload(file.path, async (cloudinaryResult) => {
      const { secure_url } = cloudinaryResult;

      try {
        // Simpan item dalam database Anda, asumsikan Anda memiliki model bernama 'Item'
        const newItem = await Item.create({
          name,
          image: { url: secure_url }, // Ganti image: secure_url menjadi image: { url: secure_url }
          url,
          description,
          price,
        });

        // Beri respons dengan data item yang baru saja dibuat
        res.status(201).json({ msg: 'Item berhasil dibuat', item: newItem });
      } catch (databaseError) {
        // Tangani kesalahan basis data, misalnya, duplikasi kunci unik
        console.error(databaseError.message);
        res.status(500).json({ msg: 'Kesalahan Server Internal saat menyimpan item' });
      }
    });
  });
};

export const updateItem = async (req, res) => {
  const item = await Item.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!item) return res.status(404).json({ msg: 'No Data Found' });
  let fileName = '';
  if (req.files === null) {
    fileName = item.image;
  } else {
    const { file } = req.files;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({
        msg:
            'Invalid Images',
      });
    }
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

    const filepath = `./public/images/${item.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `https://sapu-backend-mu.vercel.app/images/${fileName}`;
  const { description } = req.body;
  const { price } = req.body;

  try {
    await Item.update({
      name, image: fileName, url, description, price,
    }, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Item Uploaded Successfuly' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteItem = async (req, res) => {
  const item = await Item.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!item) return res.status(404).json({ msg: 'No Data Found' });
  try {
    const filepath = `./public/images/${item.image}`;
    fs.unlinkSync(filepath);
    await Item.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Item Deleted Successfuly' });
  } catch (error) {
    console.log(error.message);
  }
};
