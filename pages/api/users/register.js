import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const existingUser = await User.findOne({ email: req.body.email });
  if (!existingUser) {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: false,
    });
    const user = await newUser.save();
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
    });
  } else {
    res.status(401).send({ message: `Email already exists` });
  }
  
});

export default handler;
