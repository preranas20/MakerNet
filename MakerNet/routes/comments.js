var express = require("express");
var router  = express.Router({mergeParams: true});

var Image = require("../models/image");
var Comment = require("../models/comment");
var middleware = require("../middleware");

      
//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find image by id
    console.log(req.params.id);
    Image.findById(req.params.id, function(err, image){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {image: image});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup image using ID
   Image.findById(req.params.id, function(err, image){
       if(err){
           console.log(err);
           res.redirect("/images");
       } else {
           (new Comment({
               author: {
                   id: req.user._id,
                   username: req.user.username     
               },
               text: req.body.text
           })).save(function(err, comment) {

               Image.findOneAndUpdate(
                 {_id:req.params.id },
                 {$push:{comments:comment._id}
                 }).then(function(){
                   console.log("updated post");
                });
              
               
               console.log("image id-image:"+image);
               console.log("After saving comment to image:"+comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/images/' + image._id);
           })
           /*
        Comment.create(req.body.text, function(err, comment){
           if(err){
               console.log(err);
           } else {
               console.log("Body is: ");
               console.log(req.body);
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               //isssue here
               Image.findOneAndUpdate(
                 {_id:req.params.id },
                 {$push:{comments:comment._id}
                 }).then(function(){
                   console.log("updated post");
                });
              
               
               console.log("image id-image:"+image);
               console.log("After saving comment to image:"+comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/images/' + image._id);
           }
        });*/
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {image_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId/", function(req, res){
    
   //console.log(req.body); 
   //console.log(req.params);
   
   var query = {_id: req.params.commentId};
   var update =  { $set: { text: req.body["comment[text]"]}} 
   
   //console.log(query);
   //console.log(update);
   
  /* Comment.findOne(query).exec(function(err, data) {
       console.log(data);
   }) */
    
    Comment.findByIdAndUpdate(query, update, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/images/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Image.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/images/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;