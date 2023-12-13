import { Model, Types } from 'mongoose'

export type IAdmin = {
  id: string
  phoneNumber: string
  password: string
  role: 'admin'
  name: {
    firstName: string
    lastName: string
  }
  address: string
}
export type IAdminResponse = {
  _id: Types.ObjectId
  password?: string
  phoneNumber: string
  role: 'admin'
  name: {
    firstName: string
    lastName: string
  }
  address: string
}

export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'id' | 'password' | 'role' | 'phoneNumber'>>
  isVarifiedAdminExist(
    id: string
  ): Promise<Pick<IAdmin, 'id' | 'password' | 'role' | 'phoneNumber'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IAdmin>

// export type AdminModel = Model<IAdmin, Record<string, unknown>>
