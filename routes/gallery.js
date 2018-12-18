var express = require("express");
var router = express.Router();
var Images = require("../DBmodels/images");
var Comments = require("../DBmodels/comment");
var middleware = require("../middleware");
var seedData= [
	{name: "logo", image:"https://cti.site.live/img/ZhCjU-3DL1I-cPkK9-q98hZ-VappW.jpeg"}
]

router.get("", function(req,res){
	//get all images from gallery db
	Images.find({}, function(err, allImages){
		if(err){
			console.log(err);}
		else{
			res.render("gallery/index",{images:allImages});
		}
	});
	
});

router.post("", middleware.isLoggedIn, function(req,res){
	//get data form and add to gallery
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newImage = {name: name, image:image, description:description, author:author};
	//create a new image and save to the database
	Images.create(newImage, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			
			//redirect back to last page
			res.redirect("/gallery")
		}
	});	
});

router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("gallery/new");
});

//SHOW Images
router.get("/:id", function(req,res){
	//find the campground with the provided id
	Images.findById(req.params.id).populate("comments").exec(function(err, foundImage){
		if(err){
			console.log(err);
		} else {
			//render show template with id matching image
			res.render("gallery/show", {image: foundImage});
		}
	});

});

//EDIT GALLERY ROUTE
router.get("/:id/edit", middleware.checkImageOwnership , function(req,res){
	Images.findById(req.params.id, function(err, foundImage){
		if(err){
			res.redirect("/gallery");
		}else{
			res.render("gallery/edit", {image: foundImage});
		}
	});
})

//UPDATE GALLERY ROUTE
router.put("/:id", middleware.checkImageOwnership , function(req,res){
	Images.findByIdAndUpdate(req.params.id, req.body.newImage, function(err, updatedImages){
		if(err){
			res.redirect("/gallery");
		}else{
			res.redirect("/gallery/"+ req.params.id);
		}
	})
})

//DELETE - removes campground and its comments from the database
router.delete("/:id", middleware.checkImageOwnership , function(req, res){
	 	 
	 Images.findById(req.params.id).populate("comments").exec(function(err, foundImage){
		if(err){ console.log(err); res.redirect("/gallery");}
		else{ 
			foundImage.comments.forEach(function(comment){ Comments.findByIdAndRemove(comment.id, function(err) {console.log(err);})});	
			foundImage.remove(function (err){
				if (err){
					req.flash("error",err);
					console.log(err);
					res.redirect("/gallery");
				}else{
					req.flash("success","successfully deleted image and contents");
					res.redirect("/gallery");
				}		
			});
		}
	});

});	

module.exports = router;