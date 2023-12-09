/* eslint-disable import/extensions */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Users from '../models/UserModel.js';

export const getUsers = async (req, res) => {
  try {
    const queryOptions = {
      attributes: ['id', 'uuid', 'name', 'email', 'username', 'role', 'balance'],
    };

    const searchQuery = req.query.search;

    if (searchQuery) {
      queryOptions.where = {
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } },
          { username: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    const users = await Users.findAll(queryOptions);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// eslint-disable-next-line consistent-return
export const getUserById = async (req, res) => {
  try {
    const users = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!users) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// eslint-disable-next-line consistent-return
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, username, email } = req.body;

  try {
    const isEmailTaken = await Users.findOne({
      where: {
        email,
        id: { [Op.not]: userId },
      },
    });

    if (isEmailTaken) {
      return res.status(400).json({ msg: 'Email sudah digunakan' });
    }

    const existingUser = await Users.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    existingUser.name = name;
    existingUser.username = username;
    existingUser.email = email;

    await existingUser.save();

    res.status(200).json({ msg: 'User berhasil diupdate' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// eslint-disable-next-line consistent-return
export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: 'User tidak ditemukan' });
  }

  await Users.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ msg: 'User berhasil dihapus' });
};

// eslint-disable-next-line consistent-return
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
      role: 'user',
    });

    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
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
    const { role } = user[0];
    const access_token = jwt.sign({
      userId, name, email, balance, role,
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '60s',
    });
    const refreshToken = jwt.sign({
      userId, name, email, balance, role,
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
