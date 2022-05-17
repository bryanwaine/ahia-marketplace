import nc from 'next-connect';
import Order from '../../../models/Order';
import User from '../../../models/User';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';
import { sendOrderEmail } from '../../../utils/emailService';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  try {
    await db.connect();
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    const user = await User.findById(req.user._id);
    const email = user.email
    const cartArray = order.orderItems
    const totalPrice =order.totalPrice
    const shippingPrice = order.shippingPrice
    const itemsPrice = order.itemsPrice
    const processingAt = order.processingAt
    const orderId = order._id
    const firstName = user.firstName

    sendOrderEmail(
      email,
      cartArray,
      totalPrice,
      shippingPrice,
      itemsPrice,
      processingAt,
      orderId,
      firstName
    );
    await db.disconnect();
    res.status(201).send(order);
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

export default handler;
