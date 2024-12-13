import express from 'express';
import {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
} from '../controllers/leaveController.js';

const router = express.Router();


router.post('/leaves', createLeave);


router.get('/get', getAllLeaves);


router.get('/get/:id', getLeaveById);


router.put('/update/:id', updateLeave);

router.delete('/delete/:id', deleteLeave);

export default router;
