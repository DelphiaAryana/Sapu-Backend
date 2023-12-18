/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import path from 'path';
import { Op } from 'sequelize';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import Item from '../models/ItemModel.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCsep7MLviWXB7C-L4zt6XI5kEgzoNrQmY',
  authDomain: 'sapu-project-af7ea.firebaseapp.com',
  projectId: 'sapu-project-af7ea',
  storageBucket: 'sapu-project-af7ea.appspot.com',
  messagingSenderId: '159292158231',
  appId: '1:159292158231:web:f521459b29dbba0e184752',
  measurementId: 'G-SBSGVKV41Y',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const getItems = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    let queryOptions = {};

    if (searchQuery) {
      queryOptions = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${searchQuery}%` } }],
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
  if (req.files === null) { return res.status(400).json({ msg: 'No file uploaded' }); }

  const { file } = req.files;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const storageRef = ref(storage, `images/${fileName}`);

  try {
    await uploadBytes(storageRef, file.data);

    const imageUrl = await getDownloadURL(storageRef);

    const name = req.body.title;
    const { description } = req.body;
    const { price } = req.body;

    await Item.create({
      name,
      image: fileName,
      url: imageUrl,
      description,
      price,
    });

    res.status(201).json({ msg: 'Item created successfully' });
  } catch (error) {
    console.error('Error uploading file to Firebase Cloud Storage:', error);
    return res.status(500).json({ msg: error.message });
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
  let imageUrl = '';

  // Cek apakah ada file yang diunggah
  if (req.files === null) {
    fileName = item.image;
    imageUrl = item.url;
  } else {
    const { file } = req.files;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    // Validasi tipe file dan ukuran file
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid Images' });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: 'Image must be less than 5 MB' });
    }

    // Hapus file gambar yang lama di Firebase Cloud Storage
    const oldImageRef = ref(storage, `images/${item.image}`);
    await deleteObject(oldImageRef);

    // Upload gambar baru ke Firebase Cloud Storage
    const newImageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(newImageRef, file.data);

    // Dapatkan URL unduhan baru dari Firebase Cloud Storage
    imageUrl = await getDownloadURL(newImageRef);
  }
  const name = req.body.title;
  const { description } = req.body;
  const { price } = req.body;

  try {
    // Update data item di database
    await Item.update(
      {
        name,
        image: fileName,
        url: imageUrl,
        description,
        price,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.status(200).json({ msg: 'Item Updated Successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const deleteItem = async (req, res) => {
  const item = await Item.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!item) {
    return res.status(404).json({ msg: 'No Data Found' });
  }

  try {
    const storage = getStorage(app);
    const imageRef = ref(storage, `images/${item.image}`);

    await Item.destroy({
      where: {
        id: req.params.id,
      },
    });
    await deleteObject(imageRef);
    res.status(200).json({ msg: 'Item Deleted Successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
