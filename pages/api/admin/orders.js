import nc from 'next-connect';
import Order from '../../../models/Order';
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
    const orders = await Order.find({}).populate('user', 'firstName');
    await db.disconnect();
    if (!orders) {
      res.status(404).send({ message: 'Orders not found!' });
    } else {
      res.send(orders);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default handler;
