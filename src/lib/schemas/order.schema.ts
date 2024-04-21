import { model, models, Schema } from 'mongoose'
import { IOrderModel, IOrderSchema, ORDER_STATUS } from '../types/schema.types'

const orderSchema = new Schema<IOrderSchema, IOrderModel>(
  {
    totalAmount: Number,
    products: {
      type: [
        {
          id: String,
          size: String,
          price: Number,
          quantity: Number,
          name: String,
        },
      ],
    },
    userId: String,
    status: {
      type: String,
      enum: ORDER_STATUS,
    },
  },
  { timestamps: true }
)

export const OrderModel = (models.orders ||
  model('orders', orderSchema)) as IOrderModel
