import express from 'express'
import { CowController } from './cow.controller'
import validateRequest from '../../middlewares/validateRequest'
import { CowValidation } from './cow.validate'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const router = express.Router()

router.post(
  '/',
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
)
router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.updateCow
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getAllCows
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getSingleCow
)
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow)

export const CowRoutes = router
