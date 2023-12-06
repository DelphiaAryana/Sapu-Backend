import express from "express";
import {
    getTransaksi,
    getTransaksiById
} from "../controllers/TransaksiController.js";

const router = express.Router();

router.get('/transaksi', getTransaksi);
router.get('/transaksi/:id', getTransaksiById);

export default router;