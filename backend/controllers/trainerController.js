const Trainer = require('../models/Trainer');

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({});
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trainer
// @route   GET /api/trainers/:id
// @access  Public
const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      res.status(404);
      throw new Error('Trainer not found');
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create trainer
// @route   POST /api/trainers
// @access  Private/Admin
const createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trainer
// @route   PUT /api/trainers/:id
// @access  Private/Admin
const updateTrainer = async (req, res, next) => {
  try {
    let trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      res.status(404);
      throw new Error('Trainer not found');
    }

    trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Private/Admin
const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      res.status(404);
      throw new Error('Trainer not found');
    }

    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trainer removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer
};
