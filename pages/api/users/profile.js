import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { isAuth, signToken } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
  const user = await User.findById(req.user._id);
  (user.firstName = req.body.firstName),
    (user.lastName = req.body.lastName),
    (user.email = req.body.email),
    (user.phone = req.body.phone),
    (user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password),
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
  });
  } catch (err) {
    res.statusCode.send({ message: err.message})
  }
  
});

export default handler;
