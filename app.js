const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const ClaimHistory = require('./models/claim'); 

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Route: Home - Show leaderboard + form
app.get('/', async (req, res) => {
  const users = await User.find({});
  const sortedUsers = await User.find({}).sort({ totalPoints: -1 });
  res.render('index', { users, ClaimHistory: sortedUsers });
});

// Route: Add new user
app.post('/add', async (req, res) => {
   const { name } = req.body;
   const { profile } = req.body;
  await User.create({ profile,name, totalPoints: 0 });
  res.redirect('/');
});

// Route: Claim points
app.post('/claim', async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findById(userId);
  const randomPoints = Math.floor(Math.random() * 10) + 1;

  user.totalPoints += randomPoints;
  await user.save();

  await ClaimHistory.create({
    userId: user._id,
    profile: user.profile,
    userName: user.name,
    pointsClaimed: randomPoints,
  });

  res.redirect('/');
});



app.get('/history', async (req, res) => {
  const history = await ClaimHistory.find({}).sort({ claimedAt: -1 });
  res.render('history',{history});
});


// Start server
app.listen(3000);