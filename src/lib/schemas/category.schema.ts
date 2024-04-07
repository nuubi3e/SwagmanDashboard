import { model, models, Schema } from 'mongoose'
import { ICategoryModel, ICategorySchema } from '../types/schema.types'

const categorySchema = new Schema<ICategorySchema, ICategoryModel>(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Category must have some name'],
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
)

export const CategoryModel = (models.categories ||
  model('categories', categorySchema)) as ICategoryModel
