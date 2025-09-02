// backend/controllers/serviceController.js
import Service from '../models/Service.js';

export const createService = async (req, res, next) => {
  try {
    const { skill, category, description } = req.body;
    const service = await Service.create({
      user_id: req.user._id,
      skill,
      category,
      description,
    });
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ user_id: req.params.userId });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

// backend/controllers/serviceController.js

export const updateService = async (req, res, next) => {
  try {
    const { skill, category, description, status } = req.body; // ✅ Add 'status'

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { skill, category, description, status }, // ✅ Include 'status' in update
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
  
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};