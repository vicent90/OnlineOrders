import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const deliveryPriceSchema = new Schema({
  price: { type: Number, required: true },
  upToOrderPrice: { type: Number, required: true, default: 99999 }
},
  { timestamps: true }
);

const deliveryAddressSchema = new Schema({
  address: { type: String, required: true, unique: true },
  description: String
});


const DeliveryPrice = model('DeliveryPriceSchema', deliveryPriceSchema);
const DeliveryAddress = model('DeliveryAddressSchema', deliveryAddressSchema);

deliveryAddressSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

export { DeliveryAddress, DeliveryPrice }