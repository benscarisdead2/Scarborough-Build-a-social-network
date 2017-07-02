const express = require('express');
const app = express();
const router = express.Router();

// define an authentication routine
function guard(req, res){
    // if we have a user logged in...
    if (req.session.user) {
        // ... pass on to the next function
        next();
    } else {
        // squawk loudly!
        var err = new Error("Not logged in!");
        next(err);
    }
};

// temp storage for user information
var Users = [];

// define a route handler for /login
router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/home', function (req, res) {
    res.render('home');
});

router.get('/create', guard, function (req, res) {
    res.render('create');
});

// respond to POST request from input form
router.post('/login', function (req, res) {
    console.log([req.body.username,req.body.password]);
    // if the fields are not both filled, balk
    if (!req.body.username || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    // if both fields are filled, add new user to the array and redirect   
    } else {
        var newUser = { usr: req.body.username, pwd: req.body.password };
        Users.push(newUser);
        console.log(Users);
        req.session.user = newUser;
        res.redirect('home');
    }
});


module.exports = router;