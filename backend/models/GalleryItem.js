const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['Facilities', 'Workouts', 'Events', 'Transformations'], default: 'Facilities' },
  type: { type: String, enum: ['photo', 'video'], default: 'photo' }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
