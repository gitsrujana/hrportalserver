import Employee from '../models/employeeModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
dotenv.config();


const JWT_SECRET = 'your_jwt_secret_key'; 


const employeeValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  contactnumber:Joi.string()
  .pattern(/^[0-9]{10}$/)
  .required(),
  salary: Joi.number().positive().required(),
  address: Joi.string().min(2).required(),
  category: Joi.string().valid('IT', 'Designer', 'Developer').required(),
  file_name: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const otps = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srujanabadepally123@gmail.com",
    pass: "cvvx itcg soyq lksq",
  },
});

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = uuidv4().slice(0, 6);
  otps.set(email, otp);

  const mailOptions = {
    from: "srujanabadepally123@gmail.com",
    to: email,
    subject: "Your OTP for Job Portal Registration",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const otpStore = {};
export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


export const storeOtp = async (email, otp) => {
  const hashedOtp = await bcrypt.hash(otp, 10);
  otpStore[email] = { otp: hashedOtp, expires: Date.now() + 5 * 60 * 1000 };
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
console.log('email:', email);
console.log('otp:', otp);
console.log('otps: ', otps)
console.log('otps.get(email) === otp: ', otps.get(email) === otp);


  if (otps.get(email) === otp) {
    otps.delete(email);
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
};



export const addEmployee = async (req, res) => {
  try {
    const { name, email, password,contactnumber, salary, address, category } = req.body;

   
    const { error } = employeeValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) return res.status(400).json({ message: 'Email already exists' });

 
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const fileName = req.file ? req.file.filename : req.body.file_name;

    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      contactnumber,
      salary,
      address,
      category,
      file_name: fileName, 
    });

    const token = jwt.sign(
      { userId: newEmployee.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "Employee registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password,contactnumber, salary, address, category } = req.body;

  
    const { error } = employeeValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

 
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

   
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

   
    const updatedEmployee = await employee.update({
      name,
      email,
      password: hashedPassword || employee.password, 
      contactnumber,
      salary,
      address,
      category,
    });

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.destroy({ where: { id } });

    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export const loginemployee = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;
  try {
    const employee = await Employee .findOne({ where: { email } });
    if (!employee) {
      return res.status(404).json({ message: "employer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Employee.findByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = jwt.sign({ userId: user.id }, RESET_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

    await Employee.setResetToken(email, resetToken, resetTokenExpires);

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await Employee.findByResetToken(token);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Employee.updatePassword(user.id, passwordHash);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
