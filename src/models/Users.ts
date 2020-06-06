import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const validRoles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un role permitido'
};

const userSchema = new Schema({
  userName: { type: String, unique: true, required: [true, 'El nombre de usuario es necesario'] },
  passDB: { type: String, required: [true, 'La contraseña es necesaria'] },
  role: { type: String, required: true, default: 'ADMIN', enum: validRoles },
  locked: { type: Boolean, required: true, default: false },
  email: { type: String },
  emailAlternative: { type: String },
  address: { type: String },
  phone: { type: String },
  message: { type: String },
});

userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

export default model('User', userSchema);