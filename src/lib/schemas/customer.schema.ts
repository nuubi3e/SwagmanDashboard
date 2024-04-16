import { model, Schema } from 'mongoose';

const customerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Customer must have a name'],
    unique: true,
    minLength: [6, 'Customer must be minimum 6 character long'],
    toLower: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Customer must have an email'],
    unique: true,
    minLength: [6, 'Customer must be minimum 6 character long'],
    trim: true,
  },
});

export const CustomerModel = model('m_customers', customerSchema);
