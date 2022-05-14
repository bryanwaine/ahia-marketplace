import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import { sendVerifyEmail } from '../../../utils/emailService';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    });
  } else {
    res.status(401).send({ message: `Invalid credentials` });
  }
});

// Send verification email to registered user whose email is not verified
handler.patch(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
 
  if (
    !user.isEmailVerified
  ) {
    (user.verifyEmailToken = null),
    (user.verifyEmailExpires = null)
    const verificationCode = user.createVerificationToken();
    await sendVerifyEmail(user.email, verificationCode);
    await user.save();
    await db.disconnect();
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    });
    return res.status(200).send({
      success: true,
      message: 'Registration successful. You are signed in.',
    });
  } else if (
    user &&
    !bcrypt.compareSync(req.body.verificationCode, user.verifyEmailToken)
  ) {
    res.status(400).send({ message: `Verification code is invalid` });
  } else {
    res.status(401).send({ message: `Email does not exist.` });
  }
});

export default handler;
