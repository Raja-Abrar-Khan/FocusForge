// backend/models/Screenshot.js
import mongoose from 'mongoose';

const screenshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  imageBase64: { type: String, required: true },
  url: { type: String, default: 'Manual' },
});

export default mongoose.model('Screenshot', screenshotSchema);