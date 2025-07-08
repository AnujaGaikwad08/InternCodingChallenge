const { User } = require('../models');
const { Op } = require('sequelize');

exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    // (Reuse validation from authController if needed)
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists.' });
    const password_hash = await require('bcryptjs').hash(password, 10);
    const user = await User.create({ name, email, address, password_hash, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, sortBy = 'name', order = 'ASC', role } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    if (role) where.role = role;
    const users = await User.findAll({ where, order: [[sortBy, order]] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
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
      return res.status(400).json({ message: 'Password must be 8-16 chars, 1 uppercase, 1 special char.' });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect.' });
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 