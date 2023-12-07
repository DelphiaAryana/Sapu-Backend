import express from "express";

import { getUsers, getUserById, updateUser, deleteUser, Register } from "../controllers/Users.js";
import { verify_Token } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', adminOnly, getUsers);
router.get('/users/:id', adminOnly, getUserById);
router.patch('/users/:id', adminOnly, updateUser);
router.delete('/users/:id', adminOnly, deleteUser);

router.post('/users', Register);
router.get('/token', refreshToken);

export default router;
