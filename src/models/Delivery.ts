import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { MILISECONDS_TIMEZONE } from '../config/config';


const deliveryPriceSchema = new Schema({
  price: { type: Number, required: true },
  upToOrderPrice: { type: Number, required: true, default: 99999 }
},
  {
    timestamps: { currentTime: () => Date.now() - MILISECONDS_TIMEZONE }
  });

const deliveryAddressSchema = new Schema({
  address: { type: String, required: true, unique: true },
  description: String
});


const DeliveryPrice = model('DeliveryPriceSchema', deliveryPriceSchema);
const DeliveryAddress = model('DeliveryAddressSchema', deliveryAddressSchema);

deliveryAddressSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

export { DeliveryAddress, DeliveryPrice }