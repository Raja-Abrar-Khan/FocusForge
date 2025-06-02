// backend/controllers/Screenshot.js
import Screenshot from '../models/Screenshot.js';

export const getTodayScreenshots = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const screenshots = await Screenshot.find({
      user: req.user.id,
      date: { $gte: today },
    }).select('imageBase64 url date');
    res.json(screenshots);
  } catch (error) {
    console.error('Fetch screenshots error:', error.message);
    res.status(500).json({ error: error.message });
  }
};