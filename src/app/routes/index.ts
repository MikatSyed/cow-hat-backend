import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { CowRoutes } from '../modules/cow/cow.route'
import { OrderRoutes } from '../modules/order/order.route'
import { AdminRoutes } from '../modules/admin/admin.route'
import { AuthRoute } from '../modules/auth/auth.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
