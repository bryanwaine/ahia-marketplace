import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { sendResetPasswordSuccessEmail } from '../../../utils/emailService';

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.body.id);

    if (user && bcrypt.compareSync(req.body.token, user.passwordResetToken)) {
      user.password = bcrypt.hashSync(req.body.password);
      await user.save();
      sendResetPasswordSuccessEmail(user.email, user.firstName);
      await db.disconnect();
      return res.status(200).send({ message: 'Success' });
    } else {
      return res.status(404).send({ message: `User does not exist` });
    }
  } catch (err) {
    return res.status(err.status).send({ message: err.message });
  }
});

export default handler;
