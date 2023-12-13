import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { ICow, ICowFilters } from './cow.interface'
import { Cow } from './cow.model'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../interfaces/common'
import { queryHelpers } from '../../../helpers/paginationHelpers'
import { cowSearchableFields } from './cow.constant'
import { SortOrder } from 'mongoose'
/* @typescript-eslint/no-unused-vars */
const createCow = async (user: ICow): Promise<ICow | null> => {
  const newCow = (await Cow.create(user)).populate('seller')
  return newCow
}

const getAllCows = async (
  filters: ICowFilters,
  queryOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, sortBy, sortOrder, minPrice, maxPrice } =
    queryHelpers.calculateQuery(queryOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    andConditions.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    })
  } else if (minPrice !== undefined) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    })
  } else if (maxPrice !== undefined) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Cow.find(whereConditions)
    .sort(sortConditions)
    .populate('seller')

  //implement pagination

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResult = result.slice(startIndex, endIndex)

  const total = await Cow.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: paginatedResult,
  }
}

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller')
  return result
}

const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found !')
  }
  const { ...CowData } = payload

  const updatedCowData: Partial<ICow> = { ...CowData }

  const result = await Cow.findOneAndUpdate({ _id: id }, updatedCowData, {
    new: true,
  }).populate('seller')
  return result
}

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete({ _id: id }).populate('seller')
  return result
}

export const cowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
