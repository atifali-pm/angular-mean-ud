const  express = require('express');
const Post = require('../models/post');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post("", authenticate, (req, res, next) => {
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

router.put("/:id", authenticate, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successfully!"});
  });
});

router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!!',
      });
    }
  });
});

router.delete('/:id', authenticate, (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'Post deleted!'});
    }
  );
})

module.exports = router;

