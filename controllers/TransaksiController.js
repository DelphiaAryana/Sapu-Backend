import Transaksi from '../models/TransaksiModel.js';
import Users from '../models/UserModel.js';
import Item from '../models/ItemModel.js';

export const getTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      attributes: ['id', 'id_user', 'id_item', 'noHp', 'quantity', 'address', 'total'],
      include: [
        { model: Users, attributes: ['id'] },
        { model: Item, attributes: ['id'] } 
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
      attributes: ['id', 'noHp', 'quantity', 'address', 'total'],
      include: [
        {
          model: Users,
          attributes: ['id', 'name'], 
        },
        {
          model: Item,
          attributes: ['id', 'name', 'price'], 
        },
      ],
    });

    const formattedTransaksi = transaksi.map((trans) => ({
      id: trans.id,
      id_user: trans.User.id,
      id_item: trans.Item.id,
      noHp: trans.noHp,
      quantity: trans.quantity,
      address: trans.address,
      date: trans.createdAt,
      total: trans.total,
      user_name: trans.User.name, 
      item_name: trans.Item.name, 
      item_price: trans.Item.price,
    }));

    res.json(formattedTransaksi);
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
      const { id_user, id_item, noHp, quantity, address} = req.body;
  
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
  
  