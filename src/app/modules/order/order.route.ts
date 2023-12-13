import express from 'express'
import { orderController } from './order.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const router = express.Router()

router.post('/', auth(ENUM_USER_ROLE.BUYER), orderController.createOrder)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  orderController.getAllOrders
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  orderController.getSpecificOrder
)

export const OrderRoutes = router
