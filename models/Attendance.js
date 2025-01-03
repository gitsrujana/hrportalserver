import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import moment from 'moment-timezone';

const Attendance = sequelize.define(
  'Attendance',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'email',
      },
      primaryKey: true,
    },
    checkintime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkouttime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Absent',
    },
    workinghours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: 'attendance',
    timestamps: false,
  }
);


Attendance.checkIn = async function (email) {
  try {
    const today = new Date().toISOString().split('T')[0]; 
  
    let attendance = await Attendance.findOne({ where: { email, date: today } });

    if (!attendance) {
      attendance = await Attendance.create({
        email,
        checkintime: moment().tz('Asia/Kolkata').toDate(),
        date: today,
        status: 'Present',
        workinghours: 0,
      });
    } else if (!attendance.checkintime) {
      attendance.checkintime = moment().tz('Asia/Kolkata').toDate();
      attendance.status = 'Present';
      await attendance.save();
    }

    return {
      message: 'Check-in successful',
      checkintime: moment(attendance.checkintime).format('HH:mm:ss'), 
    };
  } catch (error) {
    throw new Error(`Error during check-in: ${error.message}`);
  }
};

Attendance.checkOut = async function (email) {
  try {
    const today = new Date().toISOString().split('T')[0];  

    const attendance = await Attendance.findOne({ where: { email, date: today } });

    if (!attendance) {
      throw new Error('No check-in record found for today.');
    }

    attendance.checkouttime = moment().tz('Asia/Kolkata').toDate();  

    if (attendance.checkintime) {
      const checkin = moment(attendance.checkintime);
      const checkout = moment(attendance.checkouttime);

      const workingHours = checkout.diff(checkin, 'hours', true); 
      attendance.workinghours = workingHours;  
    }

    await attendance.save();

    return {
      message: 'Check-out successful',
      checkouttime: moment(attendance.checkouttime).format('HH:mm:ss'),  
      workinghours: attendance.workinghours,
    };
  } catch (error) {
    throw new Error(`Error during check-out: ${error.message}`);
  }
};

export default Attendance;
