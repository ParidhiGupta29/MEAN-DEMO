const Post = require('../models/post');


exports.createPost=(req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message: 'post added successfully',
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    })
    .catch(error=>{
      res.status(500).json({
        message:"creating a post failed"
      })
    })
  }

  exports.UpdatePost= (req, res, next) => {
    let imagePath= req.body.imagePath;
    if(req.file){
      const url= req.protocol+"://"+ req.get("host");
      imagePath=  url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      
    })
    console.log(post)
    Post.updateOne({ _id: req.params.id , creator: req.userData.userId }, post)
      .then(result => {
        if(result.n > 0){
          res.status(200).json({ message: "update successful!.." });
        }
        else{
          res.status(401).json({ message: "Not Authorized!.." });
  
        }
      })
      .catch(error=>{
        res.status(500).json({
          message:"couldn't update post!"
        })
      })
  }

  exports.getPosts=(req, res, next) => {
    Post.findById(req.params.id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: "post not found..!!" })
        }
      })
      .catch(error=>{
        res.status(500).json({
          message:"Fetching post failed.!"
        })
      })
  }

  exports.getPost= (req, res, next) => {
    const pageSize= +req.query.pageSize;
    const currentPage= +req.query.page;
    const postQuery= Post.find();
    let fetchPosts;
    if(pageSize && currentPage){
      postQuery
      .skip( pageSize * (currentPage-1))
      .limit(pageSize)
    }
    postQuery.then((documents) => {
      fetchPosts= documents;
      return Post.count();
    }).then(count=>{
        res.status(200).json({
          message: 'posts fetched successfull.!',
          posts: fetchPosts,
          maxPosts: count
        });
      })
      .catch(error=>{
        res.status(500).json({
          message:"Fetching post failed.!"
        })
      })
  
  }

  exports.deletePost=(req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id ,creator: req.userData.userId })
      .then(result => {
        if(result.n > 0){
          res.status(200).json({ message: "Delete successful!.." });
        }
        else{
          res.status(401).json({ message: "Not Authorized!.." });
  
        }
      })
      .catch(error=>{
        res.status(500).json({
          message:"Deleting post failed.!"
        })
      })
  }