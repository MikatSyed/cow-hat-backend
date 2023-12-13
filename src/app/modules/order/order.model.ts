import { Schema, model } from 'mongoose'
import { OrderModel, IOrder } from './order.interface'

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: 'Cow',
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)
export const Order = model<IOrder, OrderModel>('Order', orderSchema)
