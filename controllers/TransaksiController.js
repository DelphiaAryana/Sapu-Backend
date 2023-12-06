import Transaksi from '../models/TransaksiModel.js';
import Users from '../models/UserModel.js';
import Item from '../models/ItemModel.js';

export const getTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      attributes: ['id', 'id_user', 'id_item', 'noHp', 'quantity', 'address', 'total'],
      include: [
        { model: Users, attributes: ['name'] },
        { model: Item, attributes: ['name', 'price'] } 
      ],
    });
    res.json(transaksi);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const getTableTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      attributes: ['id', 'noHp', 'quantity', 'address', 'createdAt', 'total'],
      include: [
        { model: Users, attributes: ['name'] },
        { model: Item, attributes: ['name', 'price'] } 
      ],
    });
    res.json(transaksi);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};
  
  export const getTransaksiById = async (req, res) => {
    try {
      const transaksi = await Transaksi.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!transaksi) {
          return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
      }
      res.status(200).json(transaksi);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
  };

  export const createTransaksi = async (req, res) => {
    try {
      const { id_user, id_item, noHp, quantity, address } = req.body;
  
      const item = await Item.findByPk(id_item);
      const harga = item ? item.price : 0;

      const total = harga * quantity;

      const newTransaksi = await Transaksi.create({
        id_user,
        id_item,
        noHp,
        quantity,
        address,
        total,
      });
  
      res.status(201).json(newTransaksi);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
  };
  
  