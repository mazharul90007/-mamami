import express from 'express';
import { UserRouters } from '../modules/User/user.routes';
import { UserUploadRouters } from '../modules/User/user.upload.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouters,
  },
  {
    path: '/user',
    route: UserUploadRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
