/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
import { Op } from 'sequelize';
import Riwayat from '../models/RiwayatModel.js';
import Users from '../models/UserModel.js';
import Item from '../models/ItemModel.js';

export const getRiwayat = async (req, res) => {
  try {
    const riwayat = await Riwayat.findAll({
      attributes: ['id', 'id_user', 'id_item', 'noHp', 'quantity', 'address', 'total'],
    });
    res.json(riwayat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const getTableRiwayat = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    let queryOptions = {
      attributes: ['id', 'noHp', 'quantity', 'address', 'date', 'total'],
      include: [
        { model: Users, attributes: ['name'] },
        { model: Item, attributes: ['name', 'price'] },
      ],
    };

    if (searchQuery) {
      queryOptions.where = {
        [Op.or]: [
          { '$user.name$': { [Op.like]: `%${searchQuery}%` } },
          { noHp: { [Op.like]: `%${searchQuery}%` } },
          { '$product.name$': { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    const riwayat = await Riwayat.findAll(queryOptions);
    res.json(riwayat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const getRiwayatById = async (req, res) => {
  try {
    const riwayat = await Riwayat.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!riwayat) {
      return res.status(404).json({ msg: 'Riwayat tidak ditemukan' });
    }
    res.status(200).json(riwayat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const deleteRiwayat = async (req, res) => {
  const riwayat = await Riwayat.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!riwayat) {
    return res.status(404).json({ msg: 'Riwayat tidak ditemukan' });
  }

  await riwayat.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ msg: 'Riwayat berhasil dihapus' });
};
