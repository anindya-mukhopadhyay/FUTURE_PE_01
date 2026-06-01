const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({}).populate('trainer');
    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
const getClassById = async (req, res, next) => {
  try {
    const classObj = await Class.findById(req.params.id).populate('trainer');
    if (!classObj) {
      res.status(404);
      throw new Error('Class not found');
    }
    res.json({ success: true, data: classObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Create class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = async (req, res, next) => {
  try {
    const classObj = await Class.create(req.body);
    const populatedClass = await Class.findById(classObj._id).populate('trainer');
    res.status(201).json({ success: true, data: populatedClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
const updateClass = async (req, res, next) => {
  try {
    let classObj = await Class.findById(req.params.id);
    if (!classObj) {
      res.status(404);
      throw new Error('Class not found');
    }

    classObj = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('trainer');

    res.json({ success: true, data: classObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
const deleteClass = async (req, res, next) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      res.status(404);
      throw new Error('Class not found');
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Class removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
