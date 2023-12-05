/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    // eslint-disable-next-line no-undef
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const { name } = user[0];
      const { email } = user[0];
      const { balance } = user[0];
      // eslint-disable-next-line no-undef, camelcase
      const access_token = jwt.sign({
        userId, name, email, balance,
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s',
      });
      res.json({ access_token });
    });
  } catch (error) {
    console.log(error);
  }
};
