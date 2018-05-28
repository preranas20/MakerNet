var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
   name: String,
   _id: mongoose.Schema.Types.ObjectId,
   image: String,
   
   location: String,
   //lat: Number,
   //lng: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Image", imageSchema);