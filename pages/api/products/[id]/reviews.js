import mongoose from 'mongoose';
import nc from 'next-connect';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  if (!product) {
    res.status(404).send({ message: 'Product not found!' });
  } else {
    res.send(product.reviews);
  }
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (!product) {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found!' });
  } else {
    const existingReview = product.reviews.find(
      (review) => review.user == req.user._id
    );
    if (existingReview) {
      await Product.updateOne(
        { _id: req.query.id, 'reviews._id': existingReview._id },
        {
          $set: {
            'reviews.$.comment': req.body.comment,
            'reviews.$.rating': Number(req.body.rating),
          },
        }
      );
      const updatedProduct = await Product.findById(req.query.id);
      updatedProduct.numReviews = updatedProduct.reviews.length;

      updatedProduct.rating =
        updatedProduct.reviews.reduce((a, c) => a + c.rating, 0) /
        updatedProduct.reviews.length;

      await updatedProduct.save();
      await db.disconnect();
      return res.send({ message: 'Review updated!' });
    } else {
      const review = {
        user: mongoose.Types.ObjectId(req.user._id),
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((a, c) => a + c.rating, 0) /
        product.reviews.length;

      await product.save();
      await db.disconnect();

      res.status(201).send({ message: 'Review submitted successfully!' });
    }
  }
});

export default handler;
