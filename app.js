//FRAMEWORK SETUP
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
app.set("view engine", "ejs");
require("dotenv").config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //styles directory
app.use(methodOverride("_method"));

//session setup
app.use(require("express-session")({
	secret: "Once again suki wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

//DB SETUP
var mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true } ).then(() => { console.log('Database Connected Succesfully'); }) .catch(e => { console.log(e); process.exit(); });
var Comment = require("./DBmodels/comment");
var seedDB = require("./seeds");
//seedDB();

//ROUTE CONFIGURATION
var galleryRoutes = require("./routes/gallery.js");
var authRoutes = require("./routes/auth.js");
var commentRoutes = require("./routes/comments.js");
var flashRoutes = require("./routes/flash.js");

//CONNECT ROUTES
app.use(flashRoutes); //flash before auth
app.use(authRoutes);
app.get("/", function(req,res){ res.render("landing");});  //landing route
app.use("/gallery", galleryRoutes);
app.use("/gallery", commentRoutes);

//INITIALIZE
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The YelpCamp Server Has Started!");
});