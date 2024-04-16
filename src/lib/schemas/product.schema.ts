import { Schema, model, models } from 'mongoose';
import { IProductModel, IProductSchema } from '../types/schema.types';

const productSchema = new Schema<IProductSchema, IProductModel>(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      unique: true,
      minLength: [6, 'Product must be minimum 6 character long'],
      toLower: true,
      trim: true,
    },
    units: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
      min: [100, 'Product price must greater than or equal to 100'],
    },
    sizes: {
      type: [
        {
          price: Number,
          size: String,
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      min: [0, "rating can't be less than 0⭐"],
      max: [5, "rating can't be more than 5⭐"],
      default: 0,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    reviews: {
      type: [
        {
          review: String,
          rating: {
            type: Number,
            min: [0, "rating can't be less than 0⭐"],
            max: [5, "rating can't be more than 5⭐"],
          },
          userId: String,
          username: String,
          date: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },
    ingredients: {
      type: [
        {
          name: { type: String },
          description: String,
        },
      ],
    },
    categoryId: {
      type: String,
      required: [true, 'Each Product must lie in some category'],
    },
    createdBy: {
      type: {
        id: String,
        name: String,
      },
    },
    updatedBy: {
      type: {
        id: String,
        name: String,
      },
    },
  },
  { timestamps: true }
);

const ProductModel = (models.products ||
  model('products', productSchema)) as IProductModel;
export default ProductModel;
