const express = require('express');
const app = express();
const router = express.Router();

// define an authentication routine
// notice the 'next' as a parameter
// this allows moving to the next handler in the stack
function guard(req, res, next){
    // if we have a user logged in...
    if (req.session.user) {
        // ... pass on to the next function
        next();
    } else {
        // squawk loudly!
        res.status("400");
        res.send("You must login to view this page...");
    }
};

// temp storage for user information
// this will be replaced by database access
var Users = [];

// define a route handler for /login
router.get('/login', function (req, res) {
    res.render('login');
});

// respond to POST request from input form
// at the login page
router.post('/login', function (req, res) {
    console.log([req.body.username,req.body.password]);
    // if the fields are not both filled, balk
    if (!req.body.username || !req.body.password) {
        res.status("400");
        res.send("Username and Password must both be provided.");
    // if both fields are filled, add new user to the array and redirect   
    } else {
        var newUser = { usr: req.body.username, pwd: req.body.password };
        Users.push(newUser);
        console.log(Users);
        req.session.user = newUser;
        res.redirect('home');
    }
});

// define a route handler for /signup
router.get('/signup', function (req, res) {
    res.render('signup');
});

// from here on we use the guard to prevent access unless
// there is a session active
router.get('/home', guard, function (req, res) {
    res.render('home');
});

router.get('/create', guard, function (req, res) {
    res.render('create');
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.render('login');
});




module.exports = router;