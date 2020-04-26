const Post = require('../models/post');
const cloudinary = require('cloudinary');
const fs = require('fs');

exports.createPost = (req, res, next) =>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    likeCount: 0,
    imagePath: req.body.image,
    creator: req.userData.userId
  });

  post.save().then( createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message:'Creating a post failed!'
    });
  });

};

exports.updatePost = (req, res, next) =>{
  let imagePath = req.body.imagePath;

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then( result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error =>{
    res.status(500).json({
      message:'Couldn`t updated post!'
    })
  });
};

exports.getPosts = (req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize*(currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then()
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      maxPosts: count
    })
  }).catch(error => {
    res.status(500).json({
      message:'Fetching posts failed!'
    });
  });

};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then( post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not find!'});
    }
  }).catch(error => {
    res.status(500).json({
      message:'Fetching posts failed!'
    })
  });
};

exports.likePost = (req, res, next) =>{
  const post = new Post({
    _id: req.body.id,
    likeCount: req.body.likeCount,
  });

  Post.updateOne({_id: req.params.id}, post).then( result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Like successful!'});
    }
  }).catch(error =>{
    res.status(500).json({
      message:'Couldn`t updated post!'
    })
  });
};

exports.unlikePost = (req, res, next) =>{
  const post = new Post({
    _id: req.body.id,
    likeCount: req.body.likeCount,
  });

  Post.updateOne({_id: req.params.id}, post).then( result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Unlike successful!'});
    }
  }).catch(error =>{
    res.status(500).json({
      message:'Couldn`t updated post!'
    })
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Deletion successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message:'Fetching posts failed!'
    })
  });
};
