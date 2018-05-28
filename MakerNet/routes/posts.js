var express = require("express");
var router  = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//CREATE - add new post to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to posts array
  var title = req.body.title;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newPost = {title: title, description: desc,author:author};
    // Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to images page
            console.log("New Posts:"+newlyCreated);
            res.redirect("/images");
        }
    });
});

//NEW - show form to create new image
router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log("Before creating new posts");
   res.render("posts/new"); 
});

// SHOW - shows more info about one Post
router.get("/:id", function(req, res){
    //find the post with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
          console.log(err);
        } else {
          console.log(foundPost)
          //render show template with that post
          res.render("posts/show", {post: foundPost});
        }
    });
});

//move to edit page for editing the post
router.get("/:id/edit", middleware.checkUserPost, function(req, res){
    //find the image with provided ID
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that image
            res.render("posts/edit", {post: foundPost});
        }
    });
});
//edit the post
router.put("/:id", function(req, res){
    var newData = {title: req.body.title, description: req.body.description};
    Post.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, post){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/posts/" + post._id);
        }
    });
  
});

//delete the post
router.delete("/:id", function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, post) {
    Comment.remove({
      _id: {
        $in: post.comments
      }
    }, function(err, comments) {
      req.flash('error', post.title + ' deleted!');
      res.redirect('/images');
    })
  });
});

module.exports = router;

