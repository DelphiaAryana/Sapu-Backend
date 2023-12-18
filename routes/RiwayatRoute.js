/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable indent */
import express from 'express';
import {
    getRiwayat,
    getTableRiwayat,
    getRiwayatById,
    deleteRiwayat,
} from '../controllers/RiwayatController.js';

const router = express.Router();

router.get('/riwayat', getRiwayat);
router.get('/riwayattable', getTableRiwayat);
router.get('/riwayat/:id', getRiwayatById);
router.delete('/riwayat/:id', deleteRiwayat);

export default router;
