import express from "express";
import { getUsers, Register, Login, Logout, editUser, getUserById, deleteUser } from "../controllers/Users.js";
import { verify_Token } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', Register); 
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.put('/users/:id', editUser)
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;