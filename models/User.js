import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const refreshToken = new mongoose.Schema({
  token: {
    type: String,
    trim: true,
  },
  expiration: {
    type: Date,
  },
  issued: {
    type: Date,
    default: Date.now(),
  },
});

const cartItem = new mongoose.Schema({
  name: { type: String },
  volume: { type: String },
  servings: { type: Number },
  slug: { type: String, unique: true },
  category: { type: String },
  image: { type: String },
  featuredImage: { type: String },
  isFeatured: { type: Boolean, default: false },
  price: { type: Number },
  vendor: { type: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  description: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  quantity: { type: Number}
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    cartItems: [cartItem],
    refreshTokens: [refreshToken],
    verifyEmailToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createVerificationToken = function () {
  this.verifyEmailToken = null;

  const verificationToken = crypto.randomBytes(3).toString('hex');

  this.verifyEmailToken = jwt.sign(
    { verificationToken },
    process.env.JWT_SECRET,
    {
      expiresIn: '600s',
    }
  );

  return verificationToken;
};

userSchema.methods.createPasswordResetToken = function () {
  this.passwordResetToken = null;

  const token = crypto.randomBytes(3).toString('hex');

  const resetToken = jwt.sign({ token }, process.env.JWT_SECRET, {
    expiresIn: '600s',
  });

  this.passwordResetToken = resetToken;

  return resetToken;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
