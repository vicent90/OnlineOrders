import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const validShops = {
  values: ['CARNICERIA', 'VERDULERIA'],
  message: '{VALUE} no es un negocio válido'
};

const validFruits = {
  values: ['FRUTAS', 'VERDURAS', 'ELABORADOS', 'COMPLEMENTOS'],
  message: '{VALUE} no es un tipo de carnicería válido'
};

const validMeats = {
  values: ['VACUNOS', 'AVES', 'CERDO', 'PREPARADOS', 'EMBUTIDOS'],
  message: '{VALUE} no es un tipo de carnicería válido'
};

const validMeatsPreparation = {
  values: ['MILANESAS', 'PARRILLA', 'CACEROLA', 'HORNO', '  '],
  message: '{VALUE} no es un tipo de carnicería válido'
};

const validUnitMeasure = {
  values: ['UNIDAD', 'KG'],
  message: '{VALUE} no es una unidad de medida válida'
}

const productSchema = new Schema({
  name: { type: String, unique: true, required: [true, 'El nombre del producto es necesario'] },
  price: { type: Number },
  description: { type: String },
  shop: { type: String, enum: validShops, required: [true, 'Se debe elegir un negocio: ' + validShops.values[0] + ' o ' + validShops.values[1]] },
  fruits: { type: String, required: false, enum: validFruits },
  meats: { type: String, required: false, enum: validMeats },
  meatsPreparation: { type: [String], required: false, enum: validMeatsPreparation },
  meatsPresentation: { type: String },
  unitMeasure: { type: String, required: true, default: 'KG', enum: validUnitMeasure },
  stockQuantity: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  active: { type: Boolean, required: true, default: true }
},
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

export default model('Product', productSchema);