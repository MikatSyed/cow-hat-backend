import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
/* @typescript-eslint/no-explicit-any */

const getAllUsers = async (): Promise<IUser[] | null> => {
  const result = await User.find()

  return result
}

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById({ _id: id })
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  return result
}

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }

  const { name, ...UserData } = payload

  const updatedUserData: Partial<IUser> = { ...UserData }

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser> // `name.fisrtName`
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  })

  return result
}

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id })
  return result
}

const getLoggedUser = async (id: JwtPayload): Promise<IUser | null> => {
  const result = await User.findById(id, {
    name: 1,
    phoneNumber: 1,
    address: 1,
    _id: 0,
  })
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  return result
}
const updateLoggedUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }

  const { name, password, income, budget, ...UserData } = payload

  const updatedUserData: Partial<IUser> = { ...UserData }

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser> // `name.fisrtName`
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  // Hash the password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    updatedUserData.password = hashedPassword
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  }).select({ name: 1, phoneNumber: 1, address: 1, _id: 0 })

  return result
}

export const userService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getLoggedUser,
  updateLoggedUser,
}
