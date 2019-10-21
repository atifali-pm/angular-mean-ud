const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');


const app = express();


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://atif:0lpUWBIIfgKJp9di@cluster0-ksnzx.mongodb.net/node-angular?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Connected to Mongodb');
//   // perform actions on the collection object
//   client.close();
// });


mongoose.connect("mongodb+srv://atif:0lpUWBIIfgKJp9di@cluster0-ksnzx.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to monogoDB');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());

app.use('/api/posts', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const posts = new Post({
    title: req.body.title,
    content: req.body.content
  }); //req.body;
  posts.save().then(result => {
    console.log(result);
    console.log(posts);
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'Post deleted!'});
    }
  );
})
module.exports = app;


