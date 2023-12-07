import express from "express";
import {
    getTransaksi,
    searchTransaksi,
    getTableTransaksi,
    getTransaksiById,
    createTransaksi,
    updateTransaksi,
    updateBalance,
    deleteTransaksi
} from "../controllers/TransaksiController.js";

const router = express.Router();

router.get('/transaksi', getTransaksi);
router.get('/transaksi/search', searchTransaksi);
router.get('/transaksitable', getTableTransaksi);
router.get('/transaksi/:id', getTransaksiById);
router.post('/transaksi', createTransaksi);
router.patch('/transaksi/:id', updateTransaksi);
router.post('/transaksi/:id', updateBalance);
router.delete('/transaksi/:id', deleteTransaksi);

export default router;