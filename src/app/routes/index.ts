import express from 'express';
import { UserRouters } from '../modules/User/user.routes';
import { UserUploadRouters } from '../modules/User/user.upload.routes';
import { AuthRouters } from '../modules/Auth/auth.routes';
import { CirclesRoutes } from '../modules/Circles/circles.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouters,
  },
  {
    path: '/user',
    route: UserRouters,
  },
  {
    path: '/user',
    route: UserUploadRouters,
  },
  {
    path: '/circles',
    route: CirclesRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
