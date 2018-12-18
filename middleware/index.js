var middlewareObj = {};
var Image = require("../DBmodels/images")

middlewareObj.checkImageOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Image.findById(req.params.id, function(err, foundImage){
		
			if(err){
				res.redirect("/gallery");
			}else{
				//does user own the foundImage?
				if(foundImage.author.id.equals(req.user.id)){
					return next();
				}else{
					req.flash("error", "Can't delete an image you don't own!");
					res.redirect("back");
				}
			}
		
		})	
	}else{
		req.flash("error", "You have to be logged in to do that!");
		res.redirect("back");
	}
};

//middlewareObj.checkCommentsOwnership = function(){}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj;