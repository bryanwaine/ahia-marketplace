import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import { sendVerifyEmail } from '../../../utils/emailService';

const handler = nc();

handler.post(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    await db.disconnect();
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = signToken(user);
      res.status(201).send({
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
        cartItems: user.cartItems ? user.cartItems : [],
      });
    } else {
      res.status(401).send({ message: `Invalid credentials` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Send verification email to registered user whose email is not verified || Resend verification code
handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });

    if (!user.isEmailVerified) {
      const verificationCode = user.createVerificationToken();
      await user.save();
      sendVerifyEmail(user.email, verificationCode);
      await db.disconnect();

      const token = signToken(user);
      return res.status(201).send({
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
      });
    }
    if (
      user &&
      !bcrypt.compareSync(req.body.verificationCode, user.verifyEmailToken)
    ) {
      return res.status(400).send({ message: `Verification code is invalid` });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default handler;
