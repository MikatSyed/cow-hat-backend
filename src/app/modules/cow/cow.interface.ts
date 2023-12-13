import { Model, Types } from 'mongoose'
import { IUser } from '../user/user.interface'

enum Location {
  Dhaka = 'Dhaka',
  Chattogram = 'Chattogram',
  Barishal = 'Barishal',
  Rajshahi = 'Rajshahi',
  Sylhet = 'Sylhet',
  Comilla = 'Comilla',
  Rangpur = 'Rangpur',
  Mymensingh = 'Mymensingh',
}

enum IBreed {
  Brahman = 'Brahman',
  Nellore = 'Nellore',
  Sahiwal = 'Sahiwal',
  Gir = 'Gir',
  Indigenous = 'Indigenous',
  Tharparkar = 'Tharparkar',
  Kankrej = 'Kankrej',
}

export type ILabel = 'for sale' | 'sold out'

enum ICategory {
  Dairy = 'Dairy',
  Beef = 'Beef',
  DualPurpose = 'Dual Purpose',
}

export type ICow = {
  name: string
  age: number
  price: number
  location: Location
  breed: IBreed
  weight: number
  label: ILabel | undefined
  category: ICategory
  seller: Types.ObjectId | IUser
}

export type ICowFilters = {
  searchTerm?: string
}

export type CowModel = Model<ICow, Record<string, unknown>>
