const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.addStore = async (req, res) => {
  try {
    const { name, address, owner_id } = req.body;
    const store = await Store.create({ name, address, owner_id });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', order = 'ASC' } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    const stores = await Store.findAll({ where, order: [[sortBy, order]], include: [{ model: User, as: 'User', attributes: ['id', 'name', 'email'] }] });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.findAll({ where: { store_id: storeId }, include: [{ model: User, attributes: ['id', 'name', 'email'] }] });
    const avg = ratings.length ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) : 0;
    res.json({ ratings, average: avg });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.ownerDashboard = async (req, res) => {
  try {
    // Find the store owned by the logged-in owner
    const ownerId = req.user.id;
    const store = await Store.findOne({ where: { owner_id: ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner.' });
    }
    // Get all ratings for this store, including user info
    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    // Prepare user list and average rating
    const users = ratings.map(r => ({ user_id: r.User.id, user_name: r.User.name, user_email: r.User.email, rating: r.rating }));
    const averageRating = ratings.length ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) : 0;
    res.json({ users, averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.ownerUpdatePassword = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be 8-16 chars, 1 uppercase, 1 special character.' });
    }
    const owner = await User.findByPk(ownerId);
    if (!owner) return res.status(404).json({ message: 'Owner not found.' });
    const match = await bcrypt.compare(oldPassword, owner.password_hash);
    if (!match) return res.status(400).json({ message: 'Old password is incorrect.' });
    const hash = await bcrypt.hash(newPassword, 10);
    owner.password_hash = hash;
    await owner.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 