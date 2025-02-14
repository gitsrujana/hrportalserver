
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from "uuid";


dotenv.config();



   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });




const otpStore = new Map();


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Unauthorized email" });
  }

  const otp = uuidv4().slice(0, 6);
  otpStore.set(email, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Admin Login OTP",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to admin email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};




export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Unauthorized email" });
  }
  
  if (otpStore.get(email) === otp) {
    otpStore.delete(email);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'OTP verified', token });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Unauthorized email" });
  }

  try {
    const result = await sequelize.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (!result.rows.length || !(await bcrypt.compare(password, result.rows[0].password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
