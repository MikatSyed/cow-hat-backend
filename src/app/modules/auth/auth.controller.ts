import { Request, RequestHandler, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import config from '../../../config'
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { authService } from './auth.service'
import { IUser } from '../user/user.interface'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import { User } from '../user/user.model'

const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const { ...userData } = req.body
    const result = await authService.createUser(userData)

    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User created successfully!',
      data: result,
    })
  } catch (err) {
    next(err)
  }
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await authService.loginUser(loginData)
  const { refreshToken, ...others } = result

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await authService.refreshToken(refreshToken)

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

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
}
