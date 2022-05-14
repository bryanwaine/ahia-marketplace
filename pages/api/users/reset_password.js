import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import {
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
} from '../../../utils/emailService';

const clientURL = process.env.CLIENT_URL;
const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const passwordResetToken = user.createPasswordResetToken();
      await user.save();
      const url = `${clientURL}/reset_password?token=${passwordResetToken}&id=${user._id}`;
      sendResetPasswordEmail(user.email, user.firstName, url);
      await db.disconnect();
      return res.status(200).send({ message: 'Success' });
    } else {
      return res.status(404).send({ message: `Email does not exist` });
    }
  } catch (err) {
    return res.status(err.status).send({ message: err.message });
  }
});

export default handler;
