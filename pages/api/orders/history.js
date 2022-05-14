import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const orders = await Order.find({ user: req.user._id });
    await db.disconnect();
    res.status(200).send(orders);
  } catch (err) {
    res.statusCode.send({ message: err.message });
  }
});

export default handler;
