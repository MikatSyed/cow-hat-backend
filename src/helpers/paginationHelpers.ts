import { SortOrder } from 'mongoose'
/* @typescript-eslint/no-unused-vars */

type IOptions = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
  minPrice?: number | undefined
  maxPrice?: number | undefined
}

type IOptionsResult = {
  page: number
  limit: number
  skip: number
  sortBy: string
  sortOrder: SortOrder
  minPrice: number | undefined
  maxPrice: number | undefined
}

const calculateQuery = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1)
  const limit = Number(options.limit || 10)
  const skip = (page - 1) * limit

  const sortBy = options.sortBy || 'createdAt'
  const sortOrder = options.sortOrder || 'asc'
  const minPrice = options.minPrice
  const maxPrice = options.maxPrice

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
  }
}

export const queryHelpers = {
  calculateQuery,
}
