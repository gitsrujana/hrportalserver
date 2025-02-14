import express from 'express';

import {
  sendOtp,
  verifyOtp,
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  loginemployee,
  forgotPassword,
  resetPassword,
  logout,
  getEmployeeByEmail,
 

} from '../controllers/employeeController.js';

const router = express.Router();


router.post('/otp/send', sendOtp); 
router.post('/otp/verify', verifyOtp); 


router.post('/add',  addEmployee);
router.get('/get', getAllEmployees);
router.get('/:email', getEmployeeByEmail);
router.put('/update/:email', updateEmployee); 
router.delete('/delete/:email', deleteEmployee); 


router.post('/login', loginemployee); 
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword); 
router.post('/logout',logout);




export default router;
