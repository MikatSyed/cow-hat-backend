import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ICow } from './cow.interface'
import { cowService } from './cow.service'
import { Request, Response } from 'express'
import pick from '../../../shared/pick'
import { cowFilterableFields, queryFields } from '../../../constants/pagination'

const createCow: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const { ...CowData } = req.body

    const result = await cowService.createCow(CowData)

    sendResponse<ICow>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow created successfully!',
      data: result,
    })
  } catch (err) {
    next(err)
  }
})

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields)
  const queryOptions = pick(req.query, queryFields)

  const result = await cowService.getAllCows(filters, queryOptions)

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully !',
    meta: result?.meta,
    data: result?.data,
  })
})

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await cowService.getSingleCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    data: result,
  })
})

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body

  const result = await cowService.updateCow(id, updatedData)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully !',
    data: result,
  })
})

const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await cowService.deleteCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully !',
    data: result,
  })
})

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
