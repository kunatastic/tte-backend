import express, { Router } from 'express';
import * as AuthController from '../controllers/auth.controllers';

const router: Router = express.Router();

router.post('/signIn', AuthController.signIn);
router.post('/signUp', AuthController.signUp);
router.get('/logout', AuthController.logout);
router.get('/isSignedIn', AuthController.isSignedIn);

export default router;
