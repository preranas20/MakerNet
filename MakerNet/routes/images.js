var express = require("express");
var router  = express.Router();

var Image = require("../models/image");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');




//Image upload code: integration 

const mongoose = require("mongoose");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//image upload code: end




  
// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all images
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all  from DB
      Image.find({name: regex}, function(err, allImages){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allImages);
         }
      });
  } else {
      // Get all  from DB
      Image.find({}, function(err, allImages){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allImages);
            } else {
              
            	res.render("images/index",{images: allImages, page: 'images'});
            }
         }
      });
  }
});



//CREATE - add new image to DB
router.post("/", upload.single('file'), middleware.isLoggedIn, function(req, res){
  // get data from form and add to image array
  var name = req.body.name;
  //new thing
  var image = req.file.path;
  //var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  
  geocoder.geocode(req.body.location, function (err, data) {
    //var lat = data.results[0].geometry.location.lat;
    //var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    
    
    
    var newImage = {name: name, _id: new mongoose.Types.ObjectId(), image: image, author:author, location: location};
    // Create a new  and save to DB
    Image.create(newImage, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to  page
            console.log(newlyCreated);
            
            res.redirect("/images");
        }
    });
  });
});





//NEW - show form to create new image
router.get("/new", middleware.isLoggedIn, function(req, res){
  
	res.render("images/new"); 
});





//ohm: WIP

// SHOW - shows more info about one image
router.get("/:id", function(req, res){
    //find the image with provided ID
    Image.findById(req.params.id).populate("comments").exec(function(err, foundImage){
        if(err){
          console.log(err);
        } else {
          console.log(foundImage)
          //render show template with that image
          res.render("images/show", {image: foundImage});
        }
    });
});





//ohm: WIP






router.get("/:id/edit", middleware.checkUserCampground, function(req, res){
    //find the image with provided ID
    Image.findById(req.params.id, function(err, foundImage){
        if(err){
            console.log(err);
        } else {
            //render show template with that image
            res.render("images/edit", {image: foundImage});
        }
    });
});

/*router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    //var lat = data.results[0].geometry.location.lat;
   // var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, location: location};
    Image.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, image){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/images/" + image._id);
        }
    });
  });
});*/

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    //var lat = data.results[0].geometry.location.lat;
   // var lng = data.results[0].geometry.location.lng;
	//console.log("request: " + req.body);
	  
    var location = req.body.location; //data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, location: location};
    
    Image.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, image){
        if(err){
            req.flash("error", err.message);
            req.flash("location", location);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!"); 
            req.flash("req.body.image", location);
            res.redirect("/images/" + image._id);
        }
    });
  });
});



router.delete("/:id", function(req, res) {
  Image.findByIdAndRemove(req.params.id, function(err, image) {
    Comment.remove({
      _id: {
        $in: image.comments
      }
    }, function(err, comments) {
      req.flash('error', image.name + ' deleted!');
      res.redirect('/images');
    })
  });
});

//integration to:
/*router.delete("/:galleryId", (req, res, next) => {
	  const id = req.params.galleryId;
	  Gallery.remove({ _id: id })
	    .exec()
	    .then(result => {
	      res.status(200).json({
	          message: 'gallery  deleted',
	          request: {
	              type: 'POST',
	              url: 'http://localhost:3000/gallery',
	              body: { name: 'String', price: 'Number' }
	          }
	      });
	    })
	    .catch(err => {
	      console.log(err);
	      res.status(500).json({
	        error: err
	      });
	    });
	});*/




module.exports = router;

