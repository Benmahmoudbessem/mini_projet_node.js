const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

module.exports = router;