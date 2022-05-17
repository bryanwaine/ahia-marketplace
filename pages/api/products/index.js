import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default handler;
