import { Schema, model } from 'mongoose'
import { AdminModel, IAdmin } from './admin.interface'
import bcrypt from 'bcrypt'
import config from '../../../config'
/* @typescript-eslint/no-this-alias */

const AdminSchema = new Schema<IAdmin>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin'],
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

AdminSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  )
  next()
})

AdminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'id' | 'password' | 'role' | 'phoneNumber'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { id: 1, password: 1, role: 1, phoneNumber: 1 }
  )
}

AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

AdminSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password
    delete ret.createdAt
    delete ret.updatedAt

    return ret
  },
})
AdminSchema.statics.isVarifiedAdminExist = async function (
  id: string
): Promise<Pick<IAdmin, 'id' | 'password' | 'role' | 'phoneNumber'> | null> {
  console.log(id)
  return await Admin.findOne(
    { _id: id },
    { id: 1, password: 1, role: 1, phoneNumber: 1 }
  )
}

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema)
