/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';

// eslint-disable-next-line consistent-return
export const refreshToken = async (req, res) => {
  try {
    // eslint-disable-next-line no-shadow
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    // eslint-disable-next-line consistent-return
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const { name } = user[0];
      const { email } = user[0];
      const { balance } = user[0];
      const { role } = user[0];
      // eslint-disable-next-line no-undef, camelcase
      const access_token = jwt.sign({
        userId, name, email, balance, role,
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s',
      });
      // eslint-disable-next-line camelcase
      res.json({ access_token });
    });
  } catch (error) {
    console.log(error);
  }
};
