const fs = require('fs');
const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');

const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const morgan = require("morgan");
const routes = require("./routes/router.js");
const models = require("./models")
const session = require("express-session");
//start app
const app = express();

app.use(session({
    secret: 'jumpitoff',
    resave: false,
    saveUninitialized: false
}))


app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache')
// app.set('layout', 'layout');
// app.use('/static', express.static('static'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(morgan('dev'))

app.use(routes);



app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});