import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const order = await Order.findById(req.query.id);
    await db.disconnect();
    res.send(order);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default handler;
