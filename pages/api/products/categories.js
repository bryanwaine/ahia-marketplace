import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const categories = await Product.find().distinct('category');
    await db.disconnect();
    res.send(categories);
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

export default handler;
