import Transaksi from '../models/TransaksiModel.js';

export const getTransaksi = async (req, res) => {
    try {
      const transaksi = await Transaksi.findAll({
        attributes: ['id', 'name', 'item','price', 'quantity', 'alamat', 'date', 'total'],
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
  