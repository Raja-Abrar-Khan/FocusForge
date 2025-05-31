import mongoose from 'mongoose';

const ProductivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  productiveTime: { type: Number, default: 0 },
  unproductiveTime: { type: Number, default: 0 },
  activityTime: { type: Map, of: Number, default: {} },
  hourlyData: [{ hour: Number, productiveTime: { type: Number, default: 0 }, unproductiveTime: { type: Number, default: 0 } }],
  history: [{
    startTime: Date,
    endTime: Date,
    url: String,
    data: String,
    dataType: String,
    isProductive: Boolean,
    confidence: Number,
    activityType: String,
    screenshot: { type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot' },
  }],
  category: { type: String, default: '' },
});

export default mongoose.model('Productivity', ProductivitySchema);