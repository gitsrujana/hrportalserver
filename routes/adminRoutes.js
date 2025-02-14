import express from 'express';
import { sendOtp, verifyOtp, adminLogin} from '../controllers/adminController.js';
const router = express.Router();
router.post('/login', adminLogin);
router.post('/send', sendOtp);
router.post('/verify', verifyOtp);

router.get('/email', (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    res.json({ email: adminEmail });
  });
export default router;
