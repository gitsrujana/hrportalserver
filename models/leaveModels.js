
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Leave = sequelize.define('Leave', {
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  leavedates: {
    type: DataTypes.JSONB, 
    allowNull: false,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'leaves',  
  timestamps: false,    
});

export default Leave;
