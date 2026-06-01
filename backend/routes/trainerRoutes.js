const express = require('express');
const router = express.Router();
const {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllTrainers)
  .post(protect, authorize('admin'), createTrainer);

router.route('/:id')
  .get(getTrainerById)
  .put(protect, authorize('admin'), updateTrainer)
  .delete(protect, authorize('admin'), deleteTrainer);

module.exports = router;
