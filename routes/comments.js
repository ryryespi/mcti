var express = require("express");
var router = express.Router();
var Comments = require("../DBmodels/comment");
var Images = require("../DBmodels/images");
var middleware = require("../middleware");

router.get("/:id/comments/new", middleware.isLoggedIn , function(req,res){
	// find campground by id
	//console.log(req.params.id);
	Images.findById(req.params.id, function(err, foundImage){
		if(err){
			console.log(err);
		}else{
			
			console.log(foundImage);
			res.render("comments/new", {image: foundImage});
		}
	})
});

router.post("/:id/comments", middleware.isLoggedIn , function(req,res){

//lookup image using ID
Images.findById(req.params.id, function(err, image){
	if(err){
		console.log(err);
		res.redirect("/");
		
	}else{
		//create new comment
		Comments.create(req.body.comment, function(err,comment){
			if(err){
				console.log(err);
			}else{
				//add username and id to comment
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				//connect new comment
				comment.save();
				image.comments.push(comment);
				image.save();
				res.redirect('/gallery/'+ image._id);
			}
		});
	}
});
})

module.exports = router;