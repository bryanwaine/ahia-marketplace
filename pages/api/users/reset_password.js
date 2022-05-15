import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendResetPasswordSuccessEmail } from '../../../utils/emailService';

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.body.id);
    const decodedDbToken = jwt.verify(
      user.passwordResetToken,
      process.env.JWT_SECRET
    );
    const decodedReqToken = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const passwordResetToken = decodedDbToken.token;
    const reqToken = decodedReqToken.token;
    if (passwordResetToken === reqToken) {
      user.password = bcrypt.hashSync(req.body.password);
      await user.save();
      sendResetPasswordSuccessEmail(user.email, user.firstName);
      await db.disconnect();
      return res.status(200).send({ message: 'Success' });
    } else {
      return res.status(404).send({ message: `User does not exist` });
    }
  } catch (err) {
    return res.status(400).send({ message: `Link is expired` });
  }
});

export default handler;
