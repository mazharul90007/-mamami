import express from 'express';
import { UserRouters } from '../modules/User/user.routes';
import { AuthRouters } from '../modules/Auth/auth.routes';
import { JournalRouters } from '../modules/Journal/journal.route';
import aiRoutes from '../modules/AI/ai.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouters,
  },
  {
    path: '/auth',
    route: AuthRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
