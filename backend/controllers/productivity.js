import Productivity from '../models/Productivity.js';

// Add productive time
export const addProductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const entry = await Productivity.findOneAndUpdate(
      { user: req.user._id, date: new Date().toISOString().split('T')[0] },
      { $inc: { productiveTime: seconds } },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add unproductive time
export const addUnproductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const entry = await Productivity.findOneAndUpdate(
      { user: req.user._id, date: new Date().toISOString().split('T')[0] },
      { $inc: { unproductiveTime: seconds } },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTime = async (req, res) => {
  try {
    const { seconds, isProductive } = req.body; // true/false from AI
    
    const entry = await Productivity.findOneAndUpdate(
      { 
        user: req.user._id, 
        date: new Date().toISOString().split('T')[0] 
      },
      { 
        $inc: { 
          [isProductive ? 'productiveTime' : 'unproductiveTime']: seconds 
        } 
      },
      { new: true, upsert: true }
    );

    res.json(entry);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};