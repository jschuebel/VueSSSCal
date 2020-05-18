var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs'); // required for file serving

var port = process.env.PORT || 8080;

var app = express();

//middleware. use the body-parse before the request is handled.
app.use(function (req,res,next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	
});
app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(function(req, res, next) {
		next();
})

app.get('/', function(req, res) {
	res.redirect('index.html');
//	res.render('index.jade');
});

/*
app.get("/", function( req, res) {
				res.writeHeader(500, "Internal error occurred", { "Content-Type": "text/html" });
				res.write("<html><head><title>500</title></head><body>500: Please supply disired method </body></html>");
				res.end();
});
*/

app.listen(port, function (err) {
	console.log("express listening port : " + port);
});
