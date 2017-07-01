const express = require('express');
const app = express();
const router = express.Router();

router.get('/', function (req, res){
    res.render('login')
})

router.get('/signup', function (req, res){
    res.render('signup')
})

router.get('/login', function (req, res){
    res.render('login')
})

router.get('/create', function (req, res){
    res.render('create')
})

router.get('/home', function (req, res){
    res.render('home')
})

module.exports = router;