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

export const TodayTimeasync = async(req, res) => {
  try {
    const entry = await Productivity.findOne({
      user: req.user._id,
      date: new Date().toISOString().split('T')[0],
    });

    res.json(entry || { productiveTime: 0, unproductiveTime: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ... (previous imports and controllers remain unchanged)

export const getWeeklyTime = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7); // Last 7 days
    startOfWeek.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfWeek },
    });

    const totalMetrics = entries.reduce(
      (acc, entry) => ({
        productiveTime: acc.productiveTime + (entry.productiveTime || 0),
        unproductiveTime: acc.unproductiveTime + (entry.unproductiveTime || 0),
      }),
      { productiveTime: 0, unproductiveTime: 0 }
    );

    res.json(totalMetrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};