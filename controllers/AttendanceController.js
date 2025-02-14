import Attendance from '../models/Attendance.js';
import Employee from '../models/employeeModel.js';

const AttendanceController = {

  async checkIn(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'email is required.' });
      }

      const attendance = await Attendance.checkIn(email);
      return res.status(200).json({
        message: 'Check-in successful.',
        attendance,
      });
    } catch (error) {
      console.error('Error during check-in:', error.message);
      return res.status(500).json({ message: 'An error occurred during check-in.' });
    }
  },



  
  async checkOut(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'email is required.' });
      }

      const attendance = await Attendance.checkOut(email);
      return res.status(200).json({
        message: 'Check-out successful.',
        attendance,
      });
    } catch (error) {
      console.error('Error during check-out:', error.message);
      return res.status(500).json({ message: error.message || 'An error occurred during check-out.' });
    }
  },


  async getAttendance(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ message: 'email is required.' });
      }

      const attendanceRecords = await Attendance.findAll({ where: { email } });

      if (!attendanceRecords.length) {
        return res.status(404).json({ message: 'No attendance records found.' });
      }

      return res.status(200).json(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance records:', error.message);
      return res.status(500).json({ message: 'An error occurred while fetching attendance records.' });
    }
  },
  async getAllAttendance(req, res) {
    try {
      const attendanceRecords = await Attendance.findAll();
  
      if (!attendanceRecords.length) {
        return res.status(404).json({ message: 'No attendance records found.' });
      }
  
      return res.status(200).json(attendanceRecords);
    } catch (error) {
      console.error('Error fetching all attendance records:', error.message);
      return res.status(500).json({ message: 'An error occurred while fetching attendance records.' });
    }
  },
  
  async getAttendanceByEmail(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      const attendanceRecords = await Attendance.findAll({ where: { email } });

      if (!attendanceRecords.length) {
        return res.status(404).json({ message: 'No attendance records found for this email.' });
      }

      return res.status(200).json(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance records by email:', error.message);
      return res.status(500).json({ message: 'An error occurred while fetching attendance records.' });
    }
  },

  async updateAttendanceByEmail(req, res) {
    try {
      const { email } = req.params;
      const { date, status } = req.body;
  
  
      if (!email || !date || !status) {
        return res.status(400).json({ message: 'Email, date, and status are required.' });
      }
  
      const attendanceRecord = await Attendance.findOne({ where: { email, date } });
  
   
      if (!attendanceRecord) {
        return res.status(404).json({ message: 'Attendance record not found.' });
      }
  
      attendanceRecord.status = status;
  
      
      await attendanceRecord.save();
  
  
      return res.status(200).json({
        message: 'Attendance record updated successfully.',
        updatedAttendance: attendanceRecord,
      });
    } catch (error) {
      console.error('Error updating attendance record by email:', error.message);
      return res.status(500).json({ message: 'An error occurred while updating the attendance record.' });
    }
  },
  

  
  async deleteEmployeeByEmail(req, res) {
    try {
      const { email } = req.params;
  
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }
  
   
      const deletedEmployee = await Employee.destroy({ where: { email } });
  
    
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'No employee found with this email.' });
      }
  
     
      return res.status(200).json({
        message: 'Employee and associated attendance records deleted successfully.',
        deletedEmployeeCount: deletedEmployee,
      });
    } catch (error) {
      console.error('Error deleting employee by email:', error.message);
      return res.status(500).json({ message: 'An error occurred while deleting the employee.' });
    }
  },
  
  


    async markAbsent (req, res)  {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const attendance = await Attendance.markAbsent(email);

    res.status(200).json({
      message: "Marked as absent successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error marking absent:", error);
    res.status(500).json({ message: "Server error while marking absent" });
  }
},




};
export default AttendanceController;



