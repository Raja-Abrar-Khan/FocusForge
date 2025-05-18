// File: Backend/controllers/Productivity.js
import Productivity from '../models/Productivity.js';

export const addProductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $inc: { productiveTime: seconds } },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addUnproductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user._id, date: today },
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
    const { seconds, isProductive, category } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hour = new Date().getHours();

    const update = {
      $inc: { [isProductive ? 'productiveTime' : 'unproductiveTime']: seconds }
    };

    update.$push = {
      hourlyData: {
        hour,
        [isProductive ? 'productiveTime' : 'unproductiveTime']: seconds
      }
    };

    if (category) {
      update.$set = { category };
    }

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user._id, date: today },
      update,
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const TodayTimeasync = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOne({
      user: req.user._id,
      date: today,
    });
    res.json(entry || { productiveTime: 0, unproductiveTime: 0, hourlyData: [], category: '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyTime = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfWeek },
    }).sort({ date: 1 });

    const totalMetrics = entries.reduce(
      (acc, entry) => ({
        productiveTime: acc.productiveTime + (entry.productiveTime || 0),
        unproductiveTime: acc.unproductiveTime + (entry.unproductiveTime || 0),
        dailyBreakdown: [
          ...acc.dailyBreakdown,
          {
            date: entry.date,
            productiveTime: entry.productiveTime || 0,
            unproductiveTime: entry.unproductiveTime || 0
          }
        ]
      }),
      { productiveTime: 0, unproductiveTime: 0, dailyBreakdown: [] }
    );

    res.json(totalMetrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonthlyTime = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getDate() - 30);
    startOfMonth.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfMonth },
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

export const getYearlyTime = async (req, res) => {
  try {
    const startOfYear = new Date();
    startOfYear.setDate(startOfYear.getDate() - 365);
    startOfYear.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfYear },
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

export const getHeatmapData = async (req, res) => {
  try {
    const startOfYear = new Date();
    startOfYear.setDate(startOfYear.getDate() - 365);
    startOfYear.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfYear },
    }).select('date productiveTime');

    const heatmapData = entries.map(entry => ({
      date: new Date(entry.date).toISOString().split('T')[0],
      count: Math.round(entry.productiveTime / 3600),
    }));

    res.json(heatmapData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHourlyData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).select('hourlyData');

    const hourlyMap = Array(24).fill().map(() => ({ productiveTime: 0, unproductiveTime: 0 }));
    entries.forEach(entry => {
      entry.hourlyData.forEach(({ hour, productiveTime, unproductiveTime }) => {
        hourlyMap[hour].productiveTime += productiveTime || 0;
        hourlyMap[hour].unproductiveTime += unproductiveTime || 0;
      });
    });

    res.json(hourlyMap.map((data, hour) => ({ hour, ...data })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyHours = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const data = await Productivity.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: new Date() }
    }).sort({ date: 1 });

    const weeklyHourly = data.map(day => ({
      date: day.date,
      hourly: day.hourlyData || []
    }));
    res.json(weeklyHourly);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getDate() - 30);
    startOfMonth.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfMonth },
    }).select('category productiveTime');

    const categoryMap = {};
    entries.forEach(entry => {
      if (entry.category) {
        categoryMap[entry.category] = (categoryMap[entry.category] || 0) + entry.productiveTime;
      }
    });

    res.json(Object.entries(categoryMap).map(([category, productiveTime]) => ({ category, productiveTime })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStreak = async (req, res) => {
  try {
    const startOfYear = new Date();
    startOfYear.setDate(startOfYear.getDate() - 365);
    startOfYear.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user._id,
      date: { $gte: startOfYear },
    }).sort({ date: -1 }).select('date productiveTime');

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = new Date(today);

    for (let entry of entries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(currentDate);

      if (entryDate.getTime() !== expectedDate.getTime()) break;
      if (entry.productiveTime <= 0) break;

      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};