import mongoose from 'mongoose'
import { IOrder } from './order.interface'
import { Cow } from '../cow/cow.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { Order } from './order.model'
import { JwtPayload } from 'jsonwebtoken'
/* @typescript-eslint/no-unused-vars */

const createdOrder = async (data: IOrder): Promise<IOrder | null> => {
  const { cow: cowId, buyer: buyerId } = data

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const foundCow = await Cow.findById(cowId).populate('seller').exec()
    const foundBuyer = await User.findById(buyerId)
    const Seller = await User.findById(foundCow?.seller).exec()

    if (!foundCow || !foundBuyer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cow or buyer not found')
    }

    if (foundBuyer.budget < foundCow.price) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Insufficient funds')
    }

    if (foundCow.label == 'for sale') {
      foundCow.label = 'sold out'
      await foundCow.save({ session })

      foundBuyer.budget -= foundCow.price
      await foundBuyer.save({ session })
    } else {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'This cow is already sold!')
    }

    if (Seller && Seller?.income !== undefined) {
      Seller.income = (Seller.income || 0) + foundCow.price
      await Seller.save({ session })
    }

    const createdOrder = await Order.create(data)

    await session.commitTransaction()
    await session.endSession()

    return createdOrder
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const getAllOrders = async (
  user: JwtPayload | null
): Promise<IOrder[] | null | undefined> => {
  if (user?.role === 'admin') {
    const orders = await Order.find()
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer')
      .exec()
    return orders
  } else if (user?.role === 'buyer') {
    const buyerId = user?.userId
    const orders = await Order.find({ buyer: buyerId })
    return orders
  } else if (user?.role === 'seller') {
    const id = user?.userId
    const sellerCow = await Cow.find({ seller: id }).select({ _id: 1 })
    const cowsId = sellerCow.map(cow => cow._id)

    const result = await Order.find({ cow: { $in: cowsId } })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer')
    return result
  }
}
const getSpecificOrder = async (
  user: JwtPayload | null,
  id: string
): Promise<IOrder[] | IOrder | undefined> => {
  const orderId = id
  const userId = user?.userId

  if (user?.role === 'admin') {
    const orders = await Order.find()
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer')
      .exec()
    return orders
  } else if (user?.role === 'buyer') {
    const order = Order.find({ $and: [{ _id: orderId }, { buyer: userId }] })
      .populate('cow')
      .populate('buyer')
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!')
    }
    return order
  } else if (user?.role === 'seller') {
    const sellerCow = await Cow.find({ seller: userId }).select({ _id: 1 })
    const cowsId = sellerCow.map(cow => cow._id)
    const order = Order.find({ $and: [{ _id: orderId }, { cow: cowsId }] })
      .populate('cow')
      .populate('buyer')
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!')
    }
    return order
  }
}

export const orderService = {
  createdOrder,
  getAllOrders,
  getSpecificOrder,
}
