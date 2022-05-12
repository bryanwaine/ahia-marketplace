import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import { sendVerifyEmail, sendWelcomeEmail } from '../../../utils/emailService';

const handler = nc();

// User registration
handler.post(async (req, res) => {
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
    await user.save()
    
    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    });
    try {

      await sendVerifyEmail(user.email, verificationCode);

      await db.disconnect();

      return res.status(200).send({
        success: true,
        message: 'Check your email to complete login.',
      });
    } catch (err) {
    res.status(500).send({success: false, message: err.message});

      await user.save();

      return res.status(500).send({
        success: false,
        message: 'Error sending email. Please try again.',
      });
    }
  } else {
    res.status(401).send({ message: `Email already exists. Please sign in.` });
  }
});

// Email verification
handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  if (
    user &&
    bcrypt.compareSync(req.body.verificationCode, user.verifyEmailToken)
  ) {
    (user.isEmailVerified = true), await user.save();
    await sendWelcomeEmail(user.email, user.firstName);
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
