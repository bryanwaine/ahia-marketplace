import nc from 'next-connect';
import User from '../../../../../models/User';
import db from '../../../../../utils/db';
import { onError } from '../../../../../utils/error';
import { isAuth, isAdmin } from '../../../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.query.id);
    await db.disconnect();
    if (!user) {
      res.status(404).send({ message: 'User not found!' });
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findById(req.query.id);
    user.isAdmin = Boolean(req.body.isAdmin);

    await user.save();
    await db.disconnect();
    if (!user) {
      res.status(404).send({ message: 'User not found!' });
    } else {
      res.send({ message: 'User updated successfully' });
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const product = await User.findByIdAndDelete(req.query.id);
    await db.disconnect();
    if (!product) {
      res.status(404).send({ message: 'User not found!' });
    } else {
      res.send({ message: 'User deleted successfully' });
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

export default handler;
