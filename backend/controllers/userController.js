const { User } = require('../models');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      const { name, email, age } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const user = await User.create({ name, email, age });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, age } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ name, email, age });
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;