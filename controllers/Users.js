import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const Register = async (req, res) => {
    const { name, username, email, password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    try {
        const existingUser = await Users.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah terdaftar" });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword
        });

        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
    }
};
