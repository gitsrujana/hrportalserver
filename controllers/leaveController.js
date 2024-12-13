import Joi from 'joi';
import Leave from '../models/leaveModels.js'


const leaveSchema = Joi.object({
  purpose: Joi.string().required().min(3).max(255),
  note: Joi.string().required(),
  leavedates: Joi.array().items(Joi.string().isoDate()).required(),
  days: Joi.number().integer().min(1).required(),
});


export const createLeave = async (req, res) => {
  const { error } = leaveSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const leave = await Leave.create(req.body);
    return res.status(201).json(leave);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating leave', error: err.message });
  }
};


export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll();
    return res.status(200).json(leaves);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching leaves', error: err.message });
  }
};


export const getLeaveById = async (req, res) => {
  const { id } = req.params;

  try {
    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    return res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching leave', error: err.message });
  }
};


export const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { error } = leaveSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await leave.update(req.body);
    return res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating leave', error: err.message });
  }
};


export const deleteLeave = async (req, res) => {
  const { id } = req.params;

  try {
    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await leave.destroy();
    return res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting leave', error: err.message });
  }
};
