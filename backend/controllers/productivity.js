import Productivity from '../models/Productivity.js';
import Screenshot from '../models/Screenshot.js';

export const addProductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $inc: { productiveTime: seconds } },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    console.error('Add productive time error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const addUnproductiveTime = async (req, res) => {
  try {
    const { seconds } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $inc: { unproductiveTime: seconds } },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    console.error('Add unproductive time error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateTime = async (req, res) => {
  try {
    const { seconds, isProductive, activityType, url, text, imageBase64, score } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hour = new Date().getHours();

    let screenshotId = null;
    if (imageBase64) {
      const screenshot = new Screenshot({
        user: req.user.id,
        date: today,
        imageBase64,
        url: url || 'Manual',
      });
      await screenshot.save();
      screenshotId = screenshot._id;
      console.log(`🖼️ Screenshot saved: ID ${screenshotId}`);
    }

    const update = {
      $inc: {
        [isProductive ? 'productiveTime' : 'unproductiveTime']: seconds,
        ...(activityType && activityType !== 'Unknown' ? { [`activityTime.${activityType}`]: seconds } : {}),
      },
      $push: {
        hourlyData: {
          hour,
          [isProductive ? 'productiveTime' : 'unproductiveTime']: seconds,
        },
        history: {
          $each: [{
            startTime: new Date(),
            endTime: new Date(Date.now() + seconds * 1000),
            url: url || 'Manual',
            data: text?.substring(0, 2000) || '',
            dataType: text ? 'text' : '',
            isProductive,
            confidence: score || 0.9,
            activityType: activityType || 'Unknown',
            screenshot: screenshotId,
          }],
          $slice: -100,
        },
      },
    };

    const entry = await Productivity.findOneAndUpdate(
      { user: req.user.id, date: today },
      update,
      { new: true, upsert: true }
    );

    console.log(`📊 Productivity updated for user ${req.user.id}:`, {
      productiveTime: entry.productiveTime,
      unproductiveTime: entry.unproductiveTime,
      activityTime: Object.fromEntries(entry.activityTime),
      historyLength: entry.history.length,
      screenshotId,
    });

    res.json({
      productiveTime: entry.productiveTime,
      unproductiveTime: entry.unproductiveTime,
      activityTime: Object.fromEntries(entry.activityTime),
      history: entry.history,
    });
  } catch (error) {
    console.error('Update time error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const TodayTimeasync = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOne({
      user: req.user.id,
      date: today,
    }).populate('history.screenshot');

    res.json({
      productiveTime: entry?.productiveTime || 0,
      unproductiveTime: entry?.unproductiveTime || 0,
      activityTime: entry?.activityTime ? Object.fromEntries(entry.activityTime) : {},
      hourlyData: entry?.hourlyData || [],
      history: entry?.history || [],
    });
  } catch (error) {
    console.error('Fetch today time error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getTodayHistory = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Productivity.findOne({
      user: req.user.id,
      date: today,
    }).select('history').populate('history.screenshot');

    res.json(entry?.history || []);
  } catch (error) {
    console.error('Fetch today history error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getWeeklyTime = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const entries = await Productivity.find({
      user: req.user.id,
      date: { $gte: startOfWeek },
    }).sort({ date: 1 }).populate('history.screenshot');

    const totalMetrics = entries.reduce(
      (acc, entry) => {
        acc.productiveTime += entry.productiveTime || 0;
        acc.unproductiveTime += entry.unproductiveTime || 0;
        Object.entries(entry.activityTime || {}).forEach(([key, value]) => {
          if (key !== '$schema') { // Exclude schema metadata
            acc.activityTime[key] = (acc.activityTime[key] || 0) + value;
          }
        });
        acc.dailyBreakdown.push({
          date: entry.date,
          productiveTime: entry.productiveTime || 0,
          unproductiveTime: entry.unproductiveTime || 0,
          activityTime: Object.fromEntries(
            Object.entries(entry.activityTime || {}).filter(([key]) => key !== '$schema')
          ),
          history: entry.history || [],
        });
        return acc;
      },
      { productiveTime: 0, unproductiveTime: 0, activityTime: {}, dailyBreakdown: [] }
    );

    totalMetrics.activityTime = Object.fromEntries(
      Object.entries(totalMetrics.activityTime).filter(([key]) => key !== '$schema')
    );

    res.json(totalMetrics);
  } catch (error) {
    console.error('Fetch weekly time error:', error.message);
    res.status(500).json({ error: error.message });
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
      (acc, entry) => {
        acc.productiveTime += entry.productiveTime || 0;
        acc.unproductiveTime += entry.unproductiveTime || 0;
        Object.entries(entry.activityTime || {}).forEach(([key, value]) => {
          acc.activityTime[key] = (acc.activityTime[key] || 0) + value;
        });
        return acc;
      },
      { productiveTime: 0, unproductiveTime: 0, activityTime: {} }
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
      (acc, entry) => {
        acc.productiveTime += entry.productiveTime || 0;
        acc.unproductiveTime += entry.unproductiveTime || 0;
        Object.entries(entry.activityTime || {}).forEach(([key, value]) => {
          acc.activityTime[key] = (acc.activityTime[key] || 0) + value;
        });
        return acc;
      },
      { productiveTime: 0, unproductiveTime: 0, activityTime: {} }
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

    const heatmapData = entries.map((entry) => ({
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
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    }).select('hourlyData');

    const hourlyMap = Array(24)
      .fill()
      .map(() => ({ productiveTime: 0, unproductiveTime: 0 }));
    entries.forEach((entry) => {
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
      date: { $gte: startDate, $lte: new Date() },
    }).sort({ date: 1 });

    const weeklyHourly = data.map((day) => ({
      date: day.date,
      hourly: day.hourlyData || [],
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
    }).select('activityTime productiveTime');

    const categoryMap = {};
    entries.forEach((entry) => {
      Object.entries(entry.activityTime || {}).forEach(([category, time]) => {
        categoryMap[category] = (categoryMap[category] || 0) + time;
      });
    });

    res.json(
      Object.entries(categoryMap).map(([category, productiveTime]) => ({
        category,
        productiveTime,
      }))
    );
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
    })
      .sort({ date: -1 })
      .select('date productiveTime');

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