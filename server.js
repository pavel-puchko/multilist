// Required Modules
var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var favicon    = require('static-favicon');
var app        = express();

var port = process.env.PORT || 3000;
var dbConfig = require('./config/db')
var User     = require('./models/User');
var List     = require('./models/List');
var Item     = require('./models/Item');


// Connect to DB
mongoose.connect(dbConfig.url);

app.use(favicon());
app.use(express.static(__dirname + '/public'));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
// routes
var routes = require('./routes/routes.js');
app.use('/', routes);
///

process.on('uncaughtException', function(err) {
    console.log(err);
});


// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});