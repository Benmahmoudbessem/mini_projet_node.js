const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

router.get('/dashboard', isAuthenticated, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.session.user._id });
  const stats = {
    total: tasks.length,
    enCours: tasks.filter(t => t.status === 'en cours').length,
    termine: tasks.filter(t => t.status === 'terminé').length,
    annule: tasks.filter(t => t.status === 'annulé').length
  };
  res.render('dashboard', { user: req.session.user, tasks, stats });
});

router.post('/task', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, createdBy: req.session.user._id });
  const savedTask = await task.save();
  req.app.get('io').emit('taskAdded', savedTask);
  res.redirect('/dashboard');
});

router.post('/task/delete/:id', isAuthenticated, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('taskDeleted', task._id);
  res.redirect('/dashboard');
});

router.post('/task/status/:id', isAuthenticated, async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  req.app.get('io').emit('taskUpdated', task);
  res.redirect('/dashboard');
});

module.exports = router;