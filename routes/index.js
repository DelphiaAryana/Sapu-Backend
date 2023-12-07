import express from "express";
import { getUsers, 
    searchUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    Register, 
    Login, 
    Logout } from "../controllers/Users.js";
import { verify_Token } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
