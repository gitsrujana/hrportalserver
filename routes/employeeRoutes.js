import express from 'express';
import multer from 'multer';
import {
  sendOtp,
  verifyOtp,
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginemployee,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/employeeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/otp/send', sendOtp); 
router.post('/otp/verify', verifyOtp); 


router.post('/add', upload.single('profilePicture'), addEmployee);
router.get('/get', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/update/:id', updateEmployee); 
router.delete('/delete/:id', deleteEmployee); 


router.post('/login', loginemployee); 
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword); 
router.post('/logout', logout); 

export default router;
