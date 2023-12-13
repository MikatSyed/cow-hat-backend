import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IAdmin, IAdminResponse } from './admin.interface'
import { Admin } from './admin.model'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { JwtPayload, Secret } from 'jsonwebtoken'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface'
import bcrypt from 'bcrypt'
/* @typescript-eslint/no-explicit-any */

const createAdmin = async (admin: IAdmin): Promise<IAdminResponse> => {
  const createdAdmin = await Admin.create(admin)

  return createdAdmin
}

const loginAdmin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload

  const isAdminExist = await Admin.isAdminExist(phoneNumber)

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  //create access token & refresh token

  const { id: adminId, role } = isAdminExist
  const accessToken = jwtHelpers.createToken(
    { adminId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { adminId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    )
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }

  const { adminId } = verifiedToken

  // checking deleted user's refresh token

  const isUserExist = await Admin.isVarifiedAdminExist(adminId)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  return {
    accessToken: newAccessToken,
  }
}

const getLoggedAdmin = async (id: JwtPayload): Promise<IAdmin | null> => {
  const result = await Admin.findById(
    { _id: id },
    {
      name: 1,
      phoneNumber: 1,
      address: 1,
      _id: 0,
    }
  )
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist')
  }
  return result
}

const updateLoggedAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !')
  }

  const { name, password, ...UserData } = payload

  const updatedUserData: Partial<IAdmin> = { ...UserData }

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin> // `name.fisrtName`
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  // Hash the password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    updatedUserData.password = hashedPassword
  }

  const result = await Admin.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  }).select({ name: 1, phoneNumber: 1, address: 1, _id: 0 })

  return result
}
export const adminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getLoggedAdmin,
  updateLoggedAdmin,
}
