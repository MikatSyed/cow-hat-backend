import express from 'express'
import { AdminController } from './admin.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AdminValidation } from './admin.validate'
import { AuthValidation } from '../auth/auth.validate'
import { ENUM_USER_ROLE } from '../../../enums/user'
import admin from '../../middlewares/admin'
const router = express.Router()

router.get(
  '/my-profile',
  admin(ENUM_USER_ROLE.ADMIN),
  AdminController.getLoggedAdmin
)
router.patch(
  '/my-profile',
  admin(ENUM_USER_ROLE.ADMIN),
  AdminController.updateLoggedAdmin
)

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
)
router.post(
  '/login',
  validateRequest(AdminValidation.loginZodSchema),
  AdminController.loginAdmin
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AdminController.refreshToken
)
export const AdminRoutes = router
