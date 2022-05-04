import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import onError from '../../../../utils/error';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date().toUTCString();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({ message: `Order is delivered`, order: deliveredOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: `Order not found` });
  }
});

export default handler;
