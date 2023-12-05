import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'username', 'balance'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const users = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!users) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, username, email } = req.body;

    try {
        const isEmailTaken = await Users.findOne({
            where: {
                email: email,
                id: { [Op.not]: userId }
            }
        });

        if (isEmailTaken) {
            return res.status(400).json({ msg: "Email sudah digunakan" });
        }

        // Ambil data user yang ingin diupdate
        const existingUser = await Users.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Perbarui hanya name, username, dan email
        existingUser.name = name;
        existingUser.username = username;
        existingUser.email = email;

        // Simpan perubahan ke database
        await existingUser.save();

        res.status(200).json({ msg: "User berhasil diupdate" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const deleteUser = async (req, res) => {
  try {
    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'User berhasil dihapus' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

export const Register = async (req, res) => {
  const {
    name, username, email, password, confPassword,
  } = req.body;

  if (!name || !username || !email || !password || !confPassword) return res.status(400).json({ msg: 'Mohon untuk mengisi semua kolom form.' });

  if (password !== confPassword) {
    return res.status(400).json({ msg: 'Password dan Confirm Password tidak cocok' });
  }

  try {
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name,
      username,
      email,
      password: hashPassword,
    });

    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ msg: 'Mohon isi email Anda.' });
    } if (!req.body.password) {
      return res.status(400).json({ msg: 'Mohon isi password Anda.' });
    }
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Password salah' });
    const userId = user[0].id;
    const { name } = user[0];
    const { email } = user[0];
    const { balance } = user[0];
    const access_token = jwt.sign({
      userId, name, email, balance,
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '60s',
    });
    const refreshToken = jwt.sign({
      userId, name, email, balance,
    }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    await Users.update({ refresh_token: refreshToken }, {
      where: {
        id: userId,
      },
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    });
    res.json({ access_token });
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan' });
  }
};

export const Logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({ refresh_token: null }, {
    where: {
      id: userId,
    },
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};
