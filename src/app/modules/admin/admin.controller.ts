import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'

import { adminService } from './admin.service'
import { Request, Response } from 'express'
import config from '../../../config'
import { IAdmin, IAdminResponse } from './admin.interface'
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface'

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const { ...data } = req.body
    const result = await adminService.createAdmin(data)

    sendResponse<IAdminResponse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Admin created successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
})

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await adminService.loginAdmin(loginData)
  const { refreshToken, ...others } = result

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User loggedin successfully 🐱‍🏍',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await adminService.refreshToken(refreshToken)

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User loggedin successfully',
    data: result,
  })
})

const getLoggedAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.admin.adminId

  const result = await adminService.getLoggedAdmin(id)

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin information retrieved successfully',
    data: result,
  })
})

const updateLoggedAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.admin.adminId
  const updatedData = req.body

  const result = await adminService.updateLoggedAdmin(id, updatedData)

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin information updated successfully',
    data: result,
  })
})
export const AdminController = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getLoggedAdmin,
  updateLoggedAdmin,
}
