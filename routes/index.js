import express from "express";

import { getUsers, getUserById, updateUser, deleteUser, Register } from "../controllers/Users.js";
import { verify_Token } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', Register);
router.get('/token', refreshToken);

export default router;
