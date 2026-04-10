import mongoose from 'mongoose';
import ErrorLog from '../models/ErrorLog.js';

export const getUserHistory = async (req, res) => {
  try {
    const { search, language, tag, page = 1, limit = 10 } = req.query;

    const query = { userId: req.userId };

    if (search) {
      query.$or = [
        { errorText: { $regex: search, $options: 'i' } },
        { explanation: { $regex: search, $options: 'i' } },
        { userNotes: { $regex: search, $options: 'i' } },
      ];
    }

    if (language) query.language = language;
    if (tag) query.tags = tag;

    const skip = (page - 1) * limit;

    const errors = await ErrorLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ErrorLog.countDocuments(query);

    res.json({
      errors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

export const getErrorById = async (req, res) => {
  try {
    const error = await ErrorLog.findById(req.params.id);

    if (!error) return res.status(404).json({ message: 'Error not found' });

    if (error.userId && error.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(error);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error log', error: error.message });
  }
};

export const updateError = async (req, res) => {
  try {
    const { userNotes, tags, isSolved } = req.body;
    const error = await ErrorLog.findById(req.params.id);

    if (!error) return res.status(404).json({ message: 'Error not found' });

    if (error.userId && error.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (userNotes !== undefined) error.userNotes = userNotes;
    if (tags !== undefined) error.tags = tags;
    if (isSolved !== undefined) error.isSolved = isSolved;
    error.updatedAt = new Date();

    await error.save();
    res.json(error);
  } catch (error) {
    res.status(500).json({ message: 'Error updating error log', error: error.message });
  }
};

export const deleteError = async (req, res) => {
  try {
    const error = await ErrorLog.findById(req.params.id);

    if (!error) return res.status(404).json({ message: 'Error not found' });

    if (error.userId && error.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await ErrorLog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Error deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting error log', error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const total = await ErrorLog.countDocuments({ userId });
    const solved = await ErrorLog.countDocuments({ userId, isSolved: true });

    const languageStats = await ErrorLog.aggregate([
      { $match: { userId } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    const thisWeek = await ErrorLog.countDocuments({
      userId,
      createdAt: { $gte: thisWeekStart },
    });

    res.json({ total, solved, languageStats, thisWeek });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
