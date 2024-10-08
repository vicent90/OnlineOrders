import { Schema, model } from 'mongoose';
import { MILISECONDS_TIMEZONE } from '../config/config';

const validStatus = {
  values: ['PENDIENTE', 'EN PREPARACION', 'LISTO PARA RETIRAR', 'EN CAMINO'
    , 'ENTREGADO', 'CANCELADO'],
  message: '{VALUE} no es un estado permitido'
};

const validShiftDelivery = {
  values: ['MAÑANA', 'TARDE'],
  message: '{VALUE} no es un estado permitido'
};

const orderSchema = new Schema({
  orderNumber: { type: Number },
  client: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    email: String,
    note: String
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: { type: Number, required: true },
    meatsPresentation: { type: String }
  }],
  estimatedPrice: { type: Number, required: true },
  price: { type: Number, required: false },
  deliveryAddress: { type: String, required: true },
  status: { type: String, default: "PENDIENTE", enum: validStatus },
  description: { type: String },
  estimatedDeliveryDate: { type: Date },
  shiftDelivery: { type: String, enum: validShiftDelivery },
  deliveryDate: { type: Date }
},
  {
    timestamps: { currentTime: () => Date.now() - MILISECONDS_TIMEZONE }
  });


export default model('Order', orderSchema);