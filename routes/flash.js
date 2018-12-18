var express = require("express");
var router = express.Router();

flash = require("connect-flash");

router.use(flash());

router.use(function(req,res,next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

module.exports = router;