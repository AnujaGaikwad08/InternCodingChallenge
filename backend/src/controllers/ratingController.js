const { Rating, Store, User } = require('../models');

exports.submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;
    let userRating = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
      return res.json({ message: 'Rating updated', rating: userRating });
    } else {
      userRating = await Rating.create({ user_id: userId, store_id: storeId, rating });
      return res.status(201).json({ message: 'Rating submitted', rating: userRating });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.findAll({ where: { user_id: userId }, include: [{ model: Store }] });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 