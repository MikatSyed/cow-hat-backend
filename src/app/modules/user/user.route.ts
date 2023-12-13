import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const router = express.Router()

router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.updateLoggedUser
)

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.getLoggedUser
)

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers)
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.updateUser)
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser)
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser)

export const UserRoutes = router
