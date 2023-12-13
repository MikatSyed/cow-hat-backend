import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../../config'
const UserSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['seller', 'buyer'],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  // hashing user password
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  )
  next()
})

UserSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'> | null> {
  return await User.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  )
}
UserSchema.statics.isVarifiedUserExist = async function (
  id: string
): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'> | null> {
  console.log(id)
  return await User.findOne(
    { _id: id },
    { password: 1, role: 1, phoneNumber: 1 }
  )
}

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const result = await bcrypt.compare(givenPassword, savedPassword)
  console.log(result)
  return result
}

export const User = model<IUser, UserModel>('User', UserSchema)
