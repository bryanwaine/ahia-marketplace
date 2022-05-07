import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: String, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    volume: { type: String, required: true },
    servings: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    featuredImage: { type: String },
    isFeatured: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
    vendor: { type: String, required: true },
    rating: { type: String, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
