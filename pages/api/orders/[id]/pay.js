import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date().toUTCString();
      order.paymentResult = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        reference: req.body.reference,
      };
      const paidOrder = await order.save();
      await db.disconnect();
      res.send({ message: `Order paid`, order: paidOrder });
    } else {
      await db.disconnect();
      res.status(404).send({ message: `Order not found` });
    }
  } catch (err) {
    res.statusCode.send({ message: err.message });
  }
});

export default handler;
