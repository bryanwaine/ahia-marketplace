import nc from 'next-connect';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = await new Product({
    name: req.body.name,
    volume: req.body.volume,
    servings: req.body.servings,
    slug: req.body.slug,
    category: req.body.category,
    image: req.body.image,
    price: req.body.price,
    vendor: req.body.vendor,
    countInStock: req.body.countInStock,
    description: req.body.description,
  });

  await newProduct.save();
  await db.disconnect();

  res.status(201).send({ message: 'Product created successfully' });
});

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  if (!products) {
    res.status(404).send({ message: 'Product not found!' });
  } else {
    res.send(products);
  }
});

export default handler;
