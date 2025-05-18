// File: Backend/models/Productivity.js
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
    type: Number,  
    default: 0 
  },
  unproductiveTime: { 
    type: Number,  
    default: 0 
  },
  hourlyData: [{ 
    hour: { type: Number, min: 0, max: 23 }, 
    productiveTime: { type: Number, default: 0 },
    unproductiveTime: { type: Number, default: 0 } // Added
  }],
  category: { 
    type: String 
  }
});

export default mongoose.model('Productivity', productivitySchema);