import express from "express";
import {
    getTransaksi,
    getTableTransaksi,
    getTransaksiById,
    createTransaksi
} from "../controllers/TransaksiController.js";

const router = express.Router();

router.get('/transaksi', getTransaksi);
router.get('/transaksitable', getTableTransaksi);
router.get('/transaksi/:id', getTransaksiById);
router.post('/transaksi', createTransaksi);

export default router;