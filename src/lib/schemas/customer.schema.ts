import { model, models, Schema } from 'mongoose';
import { ICustomerModel, ICustomerSchema } from '../types/schema.types';

const customerSchema = new Schema<ICustomerSchema, ICustomerModel>({
  firstName: {
    type: String,
    required: [true, 'Customer must have a name'],
    minLength: [6, 'Customer must be minimum 6 character long'],
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Customer must have an email'],
    unique: true,
    minLength: [6, 'Customer must be minimum 6 character long'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide your good usernames'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobileNo: {
    type: Number,
    unique: true,
    trim: true,
  },
});

export const CustomerModel = (models.customers ||
  model('customers', customerSchema)) as ICustomerModel;
