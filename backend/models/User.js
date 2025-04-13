import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  productivityData: [{
    date: { type: Date, default: Date.now },
    productiveTime: Number,
    unproductiveTime: Number
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);