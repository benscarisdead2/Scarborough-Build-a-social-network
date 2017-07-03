const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');


/***************************************************************
*
* global functions area
*
****************************************************************/

function validateUser(req, res) {
    // this is a user defined validation routine to confirm
    // requirements of the signup page

    //check to see if username meets criteria
    req.checkBody("username", "Username must be all letters, minimum 3 characters.").notEmpty().isAlpha().isLength({ min: 3, max: 20 });
    //check to see if password field matches confirmation text field
    req.checkBody("password", "Password and Confirmation do not match.").equals(req.body.confirmation);
    //check to see if password meets criteria
    req.checkBody("password", "Password doesn't meet criteria.").notEmpty().isAlpha().isLength({ min: 3, max: 20 });
    let errors = req.validationErrors();
    return errors;

};

// define an authentication routine
// notice the 'next' as a parameter
// this allows moving to the next handler in the stack
function guard(req, res, next) {
    // if we have a user logged in...
    if (req.session.user) {
        // ... pass on to the next function
        next();
    } else {
        // error out
        res.status("401");
        res.send("You must login to view this page...");
    }
};

/**************************************************************
 * 
 *  route handlers
 * 
**************************************************************/

// define a route handler for /login
router.get('/login', function (req, res) {
    res.render('login');
});

// respond to POST request from input form
// at the login page
router.post('/login', function (req, res) {
    let tempUsername = req.body.username;
    let tempPassword = req.body.password;
    // if the fields are not both filled, balk
    if (!tempUsername || !tempPassword) {
        res.status("400");
        res.send("Username and Password must both be provided.");
        // if both fields are filled, add new user to the array and redirect   
    } else {
        // at this point we have data in the usr/pwd form
        // we need to determine if these are in the users Table
        // and if not, return an error and retry
        models.users.findOne({ where: { name: tempUsername, password: tempPassword } }).then(
            // based on the return from the query, determine if successful or not
            function (answer) {
                if (answer) {
                    // if this isn't null, we got a valid search result
                    req.session.user = answer;
                    res.redirect('home');

                } else {
                    // the answer IS null, so balk
                    console.log('response was null');
                    res.redirect('signup');
                }
            }
        );
    }
});

// define a route handler for /signup
router.get('/signup', function (req, res) {
    res.render('signup');
});

router.post('/signup', function (req, res) {
    // validate the user input
    let validateErrors = validateUser(req, res);

    // if the signup validation is successful, then...
    if (!validateErrors) {
        // make sure the user that is being created does not already exist
        models.users.findOne({ where: { name: req.body.username, password: req.body.password } }).then(
            // based on the return from the query, determine if successful or not
            function (answer) {
                if (answer) {
                    //username and password are already in the database
                    res.render('signup', { errors: "Username and password are already registered." })
                } else {
                    //username and password aren't in the database
                    // add user to database
                    let newUser = models.users.build({
                        name: req.body.username,
                        password: req.body.password
                    });
                    newUser.save();
                    //make a session with the logged in user that was just created
                    req.session.user = newUser;
                    // send newly created user to home page
                    res.redirect('home');
                }
            }
        );
    }
    // validation at signup was NOT successful, so report errors and retry...
    else {
        //redirect back to signup page
        let errorMessages = [];
        validateErrors.forEach(function (param) {
            errorMessages.push(param.msg);
        });
        //display message to user
        res.render('signup', { errors: errorMessages });
    }
});

// from here on we use the guard to prevent access unless
// there is a session active
router.get('/home', guard, function (req, res) {
    // get the name of the logged in user and find all their gabs
     // post all the gabs on their homepage
    models.gabs.findAll().then(function (gabs) {
        res.render("home", {gabs: gabs})
    })
});

router.get('/create', guard, function (req, res) {
    res.render('create');
});

router.post('/create', function (req, res) {
    console.log(req.session.user.id);
    // validate form sent from create page
    req.checkBody("gabtext", "Only 140 characters allowed.").isLength({ max: 140 });
    var errors = req.validationErrors();
    
    if (!errors) {        
        // get userId from the users table for the current user
        console.log("no errors on create");
        // add GAB TEXT from FORM into the GAB DATABASE
            let newGab = models.gabs.create({
                text: req.body.gabtext,
                userId: req.session.user.id
            }).then(function () {
                res.redirect('/home');                
            });
        
    } else {
        console.log("errors on create");
        let errorMessages = [];

        errors.forEach(function (param) {
            errorMessages.push(param.msg);
        });
        res.render('create', {errors: errorMessages});
    }

});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.render('login');
});




module.exports = router;