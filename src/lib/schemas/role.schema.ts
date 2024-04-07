import { Schema, model, models } from 'mongoose'
import { ACTIONS, PERMISSIONS } from '../utils/global.utils'
import { IRoleModel, IRoleSchema } from '../types/schema.types'

const roleSchema = new Schema<IRoleSchema, IRoleModel>(
  {
    name: {
      type: String,
      required: [true, 'Role must contain some name'],
      unique: true,
      lowercase: true,
    },
    permissions: {
      type: [
        {
          name: {
            type: String,
            enum: PERMISSIONS,
            lowercase: true,
          },
          actions: {
            type: [String],
            enum: ACTIONS,
          },
        },
      ],
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

const RoleModel = (models.roles || model('roles', roleSchema)) as IRoleModel
export default RoleModel
