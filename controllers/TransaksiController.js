import Transaksi from '../models/TransaksiModel.js';
import Users from '../models/UserModel.js';
import Item from '../models/ItemModel.js';

export const getTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      attributes: ['id', 'id_user', 'id_item', 'noHp', 'quantity', 'address', 'total']
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
  
  export const updateTransaksi = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_user, id_item, noHp, quantity, address } = req.body;
  
      const existingTransaksi = await Transaksi.findByPk(id);
  
      if (!existingTransaksi) {
        return res.status(404).json({ msg: 'Transaksi tidak ditemukan' });
      }
  
      let harga = 0; 
  
      if (id_item) {
        const item = await Item.findByPk(id_item);
        if (!item) {
          return res.status(404).json({ msg: 'Item tidak ditemukan' });
        }
        harga = item.price; 
      } else {
        harga = existingTransaksi.Item.price;
      }
  
      const total = harga * (quantity !== undefined ? quantity : existingTransaksi.quantity);
  
      const updatedTransaksi = await existingTransaksi.update({
        id_user: id_user || existingTransaksi.id_user,
        id_item: id_item || existingTransaksi.id_item,
        noHp: noHp || existingTransaksi.noHp,
        quantity: quantity || existingTransaksi.quantity,
        address: address || existingTransaksi.address,
        total,
      });
  
      res.status(200).json(updatedTransaksi);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
  };

  export const deleteTransaksi = async (req, res) => {
    try {
      await Transaksi.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: 'Transaksi berhasil dihapus' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
  };
  
  
