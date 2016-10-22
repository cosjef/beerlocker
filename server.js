// Get the packages we need
var express = require('express');

// Create our Express application
var app = express();

// Use environment-defined port or port 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing purposes
// http://localhost:3000/application
router.get('/', function(req, res){
	res.json({message: 'You are running dangerously low on beer!'});
});

// Register all our routes with /api 
app.use('/api', router);

//Start the server
app.listen(port);
console.log('Insert beer on port ' + port);