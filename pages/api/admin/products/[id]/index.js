import nc from 'next-connect';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';
import { onError } from '../../../../../utils/error';
import { isAuth, isAdmin } from '../../../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    if (!product) {
      res.status(404).send({ message: 'Product not found!' });
    } else {
      res.send(product);
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById(req.query.id);
    (product.name = req.body.name),
      (product.volume = req.body.volume),
      (product.servings = req.body.servings),
      (product.slug = req.body.slug),
      (product.category = req.body.category),
      (product.image = req.body.image),
      (product.featuredImage = req.body.featuredImage),
      (product.isFeatured = req.body.isFeatured),
      (product.price = req.body.price),
      (product.vendor = req.body.vendor),
      (product.countInStock = req.body.countInStock),
      (product.description = req.body.description);

    await product.save();
    await db.disconnect();
    if (!product) {
      res.status(404).send({ message: 'Product not found!' });
    } else {
      res.send({ message: 'Product updated successfully' });
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findByIdAndDelete(req.query.id);
    await db.disconnect();
    if (!product) {
      res.status(404).send({ message: 'Product not found!' });
    } else {
      res.send({ message: 'Product deleted successfully' });
    }
  } catch (err) {
    res.status(err.status).send({ message: err.message });
  }
});

export default handler;
