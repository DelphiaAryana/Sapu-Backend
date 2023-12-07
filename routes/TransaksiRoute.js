import express from "express";
import {
    getTransaksi,
    getTableTransaksi,
    getTransaksiById,
    createTransaksi,
    updateTransaksi,
    deleteTransaksi
} from "../controllers/TransaksiController.js";
import { adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/transaksi', adminOnly, getTransaksi);
router.get('/transaksitable', adminOnly, getTableTransaksi);
router.get('/transaksi/:id', getTransaksiById);
router.post('/transaksi', adminOnly, createTransaksi);
router.patch('/transaksi/:id', adminOnly, updateTransaksi);
router.delete('/transaksi/:id', adminOnly, deleteTransaksi);

export default router;