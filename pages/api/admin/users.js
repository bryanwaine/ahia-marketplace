import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const users = await User.find({});
    await db.disconnect();
    if (!users) {
      res.status(404).send({ message: 'Users not found!' });
    } else {
      res.send(users);
    }
  } catch (err) {
    res.statusCode.send({ message: err.message });
  }
});

export default handler;
