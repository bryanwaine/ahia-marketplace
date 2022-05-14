import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import { sendVerifyEmail, sendWelcomeEmail } from '../../../utils/emailService';

const handler = nc();

// User registration
handler.post(async (req, res) => {
  try {
    await db.connect();
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      let user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
        verifyEmailToken: '',
      });
      const verificationCode = user.createVerificationToken();
      await user.save();
      sendVerifyEmail(user.email, verificationCode);
      await db.disconnect();
      
      return res.status(201).send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
      });
    } else {
      return res
        .status(401)
        .send({ message: `Email already exists. Please sign in.` });
    }
  } catch (err) {
    return res.statusCode.send({ message: err.message });
  }
});

// Email verification
handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    if (
      user &&
      bcrypt.compareSync(req.body.verificationCode, user.verifyEmailToken)
    ) {
      (user.isEmailVerified = true), await user.save();
      await db.disconnect();
      sendWelcomeEmail(user.email, user.firstName);

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
    } else if (
      user &&
      !bcrypt.compareSync(req.body.verificationCode, user.verifyEmailToken)
    ) {
      return res.status(400).send({ message: `Verification code is invalid` });
    } else {
      return res.status(401).send({ message: `Email does not exist.` });
    }
  } catch (err) {
    return res.statusCode.send({ message: err.message });
  }
});

export default handler;
