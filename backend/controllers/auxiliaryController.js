const Offer = require('../models/Offer');
const GalleryItem = require('../models/GalleryItem');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const ContactQuery = require('../models/ContactQuery');

// ==========================================
// OFFERS MANAGEMENT
// ==========================================
const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    next(error);
  }
};

const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GALLERY MANAGEMENT
// ==========================================
const getGallery = async (req, res, next) => {
  try {
    const gallery = await GalleryItem.find({});
    res.json({ success: true, count: gallery.length, data: gallery });
  } catch (error) {
    next(error);
  }
};

const uploadGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await GalleryItem.create(req.body);
    res.status(201).json({ success: true, data: galleryItem });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NEWSLETTER SUBSCRIBERS
// ==========================================
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'You are already subscribed to our newsletter' });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ success: true, message: 'Thank you for subscribing to Newtown Fitness newsletter!' });
  } catch (error) {
    next(error);
  }
};

const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTACT INQUIRIES
// ==========================================
const submitContactQuery = async (req, res, next) => {
  try {
    const query = await ContactQuery.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Your query has been recorded. Our team will contact you shortly.',
      data: query
    });
  } catch (error) {
    next(error);
  }
};

const getContactQueries = async (req, res, next) => {
  try {
    const queries = await ContactQuery.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    next(error);
  }
};

const resolveContactQuery = async (req, res, next) => {
  try {
    const { adminResponse } = req.body;
    const query = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', adminResponse },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, message: 'Query marked as resolved and response recorded', data: query });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
