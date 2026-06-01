const express = require('express');
const router = express.Router();
const {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getGallery,
  uploadGalleryItem,
  deleteGalleryItem,
  subscribeNewsletter,
  getNewsletterSubscribers,
  submitContactQuery,
  getContactQueries,
  resolveContactQuery
} = require('../controllers/auxiliaryController');
const { protect, authorize } = require('../middleware/auth');

// Offers
router.get('/offers', getOffers);
router.post('/offers', protect, authorize('admin'), createOffer);
router.put('/offers/:id', protect, authorize('admin'), updateOffer);
router.delete('/offers/:id', protect, authorize('admin'), deleteOffer);

// Gallery
router.get('/gallery', getGallery);
router.post('/gallery', protect, authorize('admin'), uploadGalleryItem);
router.delete('/gallery/:id', protect, authorize('admin'), deleteGalleryItem);

// Newsletter
router.post('/newsletter/subscribe', subscribeNewsletter);
router.get('/newsletter/subscribers', protect, authorize('admin'), getNewsletterSubscribers);

// Queries
router.post('/contact/submit', submitContactQuery);
router.get('/contact/queries', protect, authorize('admin'), getContactQueries);
router.put('/contact/queries/:id/resolve', protect, authorize('admin'), resolveContactQuery);

module.exports = router;
