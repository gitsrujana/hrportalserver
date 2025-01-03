import express from 'express';
import AttendanceController from '../controllers/AttendanceController.js';

const router = express.Router();

router.post('/checkin', AttendanceController.checkIn);
router.post('/checkout', AttendanceController.checkOut);
router.get('/get', AttendanceController.getAllAttendance);
router.get('/:email', AttendanceController.getAttendance);
router.get('/record/:email', AttendanceController.getAttendanceByEmail);
router.put('/update/:email', AttendanceController.updateAttendanceByEmail);
router.delete('/delete/:email', AttendanceController.deleteEmployeeByEmail);
router.post('/mark-absent',AttendanceController. markAbsent);

export default router;
