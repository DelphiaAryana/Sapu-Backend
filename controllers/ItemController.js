/* eslint-disable import/no-import-module-exports */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import cloudinary from '../config/cloudinary.js';
import Item from '../models/ItemModel.js';
// import upload from '../middleware/multer.js';

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
  try {
    if (!req.file) return res.status(400).json({ msg: 'Tidak ada file yang diunggah' });

    const { title, description, price } = req.body;
    const { file } = req;
    const ext = path.extname(file.originalname);
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Tipe gambar tidak valid' });
    }

    if (file.size > 5000000) {
      return res.status(422).json({ msg: 'Gambar harus kurang dari 5 MB' });
    }

    cloudinary.uploader.upload(file.path, async (cloudinaryResult) => {
      const { secure_url } = cloudinaryResult;

      // Simpan item dalam database Anda, asumsikan Anda memiliki model bernama 'Item'
      await Item.create({
        name: title,
        image: secure_url,
        url: secure_url, // Anda dapat memodifikasi ini berdasarkan kebutuhan Anda
        description,
        price,
      });

      res.status(201).json({ msg: 'Item berhasil dibuat' });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Kesalahan Server Internal' });
  }
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
