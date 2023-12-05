import express from "express";
<<<<<<< HEAD
import { getUsers, getUserById, updateUser, deleteUser, Register, Login, Logout } from "../controllers/Users.js";
=======
import { getUsers, Register, Login, Logout, editUser, getUserById, deleteUser } from "../controllers/Users.js";
>>>>>>> c43c3dcc697e1f996214b2030542505981af4a8b
import { verify_Token } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

<<<<<<< HEAD
router.get('/users', verify_Token, getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', Register);
=======
router.get('/users', getUsers);
router.post('/users', Register); 
>>>>>>> c43c3dcc697e1f996214b2030542505981af4a8b
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.put('/users/:id', editUser)
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
