import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Attendance from './Attendance.js';
const Employee = sequelize.define('Employee', {
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
     primaryKey: true,
      field: 'email'
  },
  
  
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactnumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
}, {
  tableName: 'employees',
  timestamps: false,
});
Employee.hasMany(Attendance, {
  foreignKey: 'email',
  onDelete: 'CASCADE', 
  onUpdate: 'CASCADE',
});

Attendance.belongsTo(Employee, {
  foreignKey: 'email',
});
export default Employee