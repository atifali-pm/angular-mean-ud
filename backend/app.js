const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

// Mean cluster: https://cloud.mongodb.com/v2/5db2df49c56c98757a291ed0#clusters
mongoose.connect("mongodb+srv://atif:KpXkzwTJm1ozp7Wk@cluster0-asa0a.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to monogoDB');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());

app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", usersRoutes);
module.exports = app;


