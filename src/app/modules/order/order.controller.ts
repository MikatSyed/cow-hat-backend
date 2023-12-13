import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IOrder } from './order.interface'
import { orderService } from './order.service'
import { Request, Response } from 'express'

const createOrder: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const { ...data } = req.body
    const newOrder = await orderService.createdOrder(data)

    sendResponse<IOrder>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Orders created successfully',
      data: newOrder,
    })
  } catch (err) {
    next(err)
  }
})

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await orderService.getAllOrders(user)

  sendResponse<IOrder[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully !',
    data: result,
  })
})
const getSpecificOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const orderId = req.params.id
  const result = await orderService.getSpecificOrder(user, orderId)

  sendResponse<IOrder[] | IOrder>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully !',
    data: result,
  })
})

export const orderController = {
  createOrder,
  getAllOrders,
  getSpecificOrder,
}
