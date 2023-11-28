import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_Token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        // eslint-disable-next-line no-undef
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const balance = user[0].balance;
            // eslint-disable-next-line no-undef
            const access_token = jwt.sign({userId, name, email, balance}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });
            res.json({ access_token });
        });
    } catch (error) {
        console.log(error);
    }
}