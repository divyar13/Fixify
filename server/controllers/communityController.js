import ErrorLog from '../models/ErrorLog.js';

export const shareError = async (req, res) => {
  try {
    const { errorId, isAnonymous } = req.body;

    const error = await ErrorLog.findById(errorId);

    if (!error) {
      return res.status(404).json({ message: 'Error not found' });
    }

    if (error.userId && error.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    error.isShared = true;
    error.isAnonymous = isAnonymous !== undefined ? isAnonymous : true;

    await error.save();
    res.json({ message: 'Error shared successfully', error });
  } catch (error) {
    res.status(500).json({
      message: 'Error sharing error log',
      error: error.message,
    });
  }
};

export const unshareError = async (req, res) => {
  try {
    const error = await ErrorLog.findById(req.params.id);

    if (!error) {
      return res.status(404).json({ message: 'Error not found' });
    }

    if (error.userId && error.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    error.isShared = false;
    await error.save();
    res.json({ message: 'Error unshared successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error unsharing error log',
      error: error.message,
    });
  }
};

export const getCommunityFeed = async (req, res) => {
  try {
    const { language, page = 1, limit = 10, sortBy = 'newest' } = req.query;

    const query = { isShared: true };

    if (language) {
      query.language = language;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'popular') {
      sort = { upvotes: -1, createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const errors = await ErrorLog.find(query)
      .select('errorText language explanation tags upvotes createdAt isAnonymous userId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ErrorLog.countDocuments(query);

    res.json({
      errors: errors.map((err) => ({
        ...err.toObject(),
        userId: err.isAnonymous ? null : err.userId,
      })),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching community feed',
      error: error.message,
    });
  }
};

export const upvoteError = async (req, res) => {
  try {
    const error = await ErrorLog.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!error) {
      return res.status(404).json({ message: 'Error not found' });
    }

    res.json(error);
  } catch (error) {
    res.status(500).json({
      message: 'Error upvoting',
      error: error.message,
    });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const languages = await ErrorLog.distinct('language', { isShared: true });
    res.json(languages.filter((lang) => lang && lang !== 'Unknown'));
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching languages',
      error: error.message,
    });
  }
};
