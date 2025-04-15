import mongoose from 'mongoose';

const productivitySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  date: { 
    type: Date,
    default: Date.now 
  },
  productiveTime: { 
    type: Number,  // in seconds
    default: 0 
  },
  unproductiveTime: { 
    type: Number,  // in seconds
    default: 0 
  }
});

export default mongoose.model('Productivity', productivitySchema);