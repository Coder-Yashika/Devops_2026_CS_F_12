import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  registerStudent,
  registerFaculty,
  verifyOtp,
  login,
} from '../controllers/authController.js';

const router = Router();

router.post(
  '/register/student',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('enrollmentNumber').trim().notEmpty().withMessage('Enrollment number is required'),
    body('email').isEmail().withMessage('A valid college email is required'),
    body('mobileNumber').isMobilePhone('any').withMessage('A valid mobile number is required'),
    body('department').trim().notEmpty(),
    body('course').trim().notEmpty(),
    body('year').isInt({ min: 1, max: 6 }),
    body('semester').isInt({ min: 1, max: 12 }),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  registerStudent
);

router.post(
  '/register/faculty',
  [
    body('fullName').trim().notEmpty(),
    body('facultyId').trim().notEmpty(),
    body('email').isEmail(),
    body('department').trim().notEmpty(),
    body('designation').trim().notEmpty(),
    body('mobileNumber').isMobilePhone('any'),
    body('password').isLength({ min: 8 }),
  ],
  validate,
  registerFaculty
);

router.post(
  '/verify-otp',
  [body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 })],
  validate,
  verifyOtp
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);

export default router;
