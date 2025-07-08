const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

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