import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
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

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    refreshTokens: [refreshToken],
    verifyEmailToken: {
      type: String,
    },
    verifyEmailExpires: {
      type: Date,
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

  this.verifyEmailExpires = null;

  const verificationToken = crypto.randomBytes(3).toString('hex');

  this.verifyEmailToken = bcrypt.hashSync(verificationToken);

  this.verifyEmailExpires = Date.now() + 10 * 60 * 1000;

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
