var express = require("express");
var router = express.Router();
var User = require("../DBmodels/user");
//AUTH SETUP
var passport = require("passport");
var LocalStrategy = require("passport-local");


//PASSPORT CONFIGURATION
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=======
//AUTH
//=======
router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

router.get("/login", function(req, res) {
    res.render("auth/login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/gallery",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/register", function(req, res) {
    res.render("auth/register");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/gallery");
});

router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("auth/register")
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/gallery");
        });
    })
})



module.exports = router;