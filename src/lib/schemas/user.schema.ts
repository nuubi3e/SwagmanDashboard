import { Schema, model, models } from 'mongoose'
import { IUserModel, IUserSchema } from '../types/schema.types'

const userSchema = new Schema<IUserSchema, IUserModel>(
  {
    displayPic: { type: String, default: '' },
    fullName: {
      type: String,
      required: [true, 'Please provide your good name'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Please provide your good name'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter some password'],
    },
    roleId: {
      type: String,
      required: [true, 'Please Provide a role'],
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

const UserModel = (models.users || model('users', userSchema)) as IUserModel

export default UserModel
