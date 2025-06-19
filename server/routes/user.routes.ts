import express, { type Router } from 'express';
import {
    register,
    login,
    logout,
    googleAuth,
    changePassword,
    resetPassword,
    sendResetPasswordEmail,
    updateUserData,
    resendVerificationEmail
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth.middleware';


const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/reset-password', resetPassword);
router.post('/reset-password/email', sendResetPasswordEmail);
router.post('/verification-email', resendVerificationEmail);

//~ Protected Routes
router.post('/logout', authUserMiddleware, logout);
router.put('/password', authUserMiddleware, changePassword);
router.put('/', authUserMiddleware, updateUserData);

export default router;