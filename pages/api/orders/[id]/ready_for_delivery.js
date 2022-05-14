import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
      order.isReadyForDelivery = true;
      order.readyForDeliveryAt = new Date().toUTCString();
      const readyForDelivery = await order.save();
      await db.disconnect();
      res.send({
        message: `Order is ready for delivery`,
        order: readyForDelivery,
      });
    } else {
      await db.disconnect();
      res.status(404).send({ message: `Order not found` });
    }
  } catch (err) {
    res.statusCode.send({ message: err.message });
  }
});

export default handler;
