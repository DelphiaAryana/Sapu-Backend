/* eslint-disable import/extensions */
/* eslint-disable indent */
import express from 'express';
import {
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    createItem,
} from '../controllers/ItemController.js';

const router = express.Router();

router.get('/items', getItems);
router.get('/items/:id', getItemById);
// router.get('/public/images/:fileName', getImage);
router.post('/items', createItem);
router.patch('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

export default router;
