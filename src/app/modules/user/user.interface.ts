import { Model, Types } from 'mongoose'

export type IUser = {
  _id: Types.ObjectId
  phoneNumber: string
  role: 'seller' | 'buyer'
  password: string
  name: {
    firstName: string
    lastName: string
  }
  address: string
  budget: number
  income: number | null
}

export type UserModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'>>
  isVarifiedUserExist(
    id: string
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>

// export type UserModel = Model<IUser, Record<string, unknown>>
