import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        volume: { type: String, required: true },
        quantity: { type: Number, required: true},
        image: { type: String, required: true},
        price: { type: Number, required: true},
        slug: { type: String, required: true},
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {name: String, email: String, phone: String, reference: String, status: String},
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isProcessing: { type: Boolean, required: true, default: false},
    isReadyForDelivery: { type: Boolean, required: true, default: false},
    isPaid: { type: Boolean, required: true, default: false},
    isDelivered: { type: Boolean, required: true, default: false },
    processingAt: {type: String},
    readyForDeliveryAt: {type: String},
    paidAt: {type: String},
    deliveredAt: {type: String}
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
