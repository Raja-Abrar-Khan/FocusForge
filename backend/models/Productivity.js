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
    productiveTime: { type: Number, default: 0 } 
  }], // e.g., [{ hour: 9, productiveTime: 3600 }]
  category: { 
    type: String 
  } // e.g., "coding", "studying"
});

export default mongoose.model('Productivity', productivitySchema);