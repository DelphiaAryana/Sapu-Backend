/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, Register, Login, Logout } from "../controllers/Users";
import { refreshToken } from "../controllers/RefreshToken";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', Login);
router.post('/users', Register);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
