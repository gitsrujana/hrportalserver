import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Employee = sequelize.define('Employee', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactnumber:{
    type:DataTypes.STRING,
    allowNull:false,
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
file_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'employees',
  timestamps: false, 
});

export default Employee;
