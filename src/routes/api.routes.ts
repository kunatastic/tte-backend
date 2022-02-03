import { Router } from 'express';
import DemoRoutes from './demo.routes';
import AuthRoutes from './auth.routes';

const router: Router = Router();

router.use('/', DemoRoutes);
router.use('/auth', AuthRoutes);

export default router;
