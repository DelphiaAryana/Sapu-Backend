import express from "express";
import {
    getItems,
    getItemById,
    searchItem,
    saveItem,
    updateItem,
    deleteItem
} from "../controllers/ItemController.js";
import { adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/items', getItems);
router.get('/items/search', searchItem);
router.get('/items/:id', getItemById);
router.post('/items', adminOnly, saveItem);
router.patch('/items/:id', adminOnly, updateItem);
router.delete('/items/:id', adminOnly, deleteItem);

export default router;