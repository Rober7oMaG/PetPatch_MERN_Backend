import express from 'express';
import {
    register, 
    profile, 
    confirm, 
    login, 
    forgotPassword, 
    checkToken, 
    resetPassword, 
    updateProfile,
    updatePassword
} from '../controllers/VeterinarianController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/', register);
router.get('/confirm/:token', confirm);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.route('/forgot/:token').get(checkToken).post(resetPassword);

//Private
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
router.put('/change-password/', checkAuth, updatePassword);

export default router;