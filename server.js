// Get the packages we need
// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var Beer = require('./models/beer');
var bodyParser = require('body-parser')

// Connect to the beerlocker MongoDB instance
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Express application
var app = express();

// Use the body-parser package in our application
// body-parser is express middleware that extract the entire body portion of an incoming request stream 
// and exposes it on req.body as something easier to interface with
app.use(bodyParser.urlencoded({
	extended: true
}))

// Use environment-defined port or port 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing purposes
// http://localhost:3000/application
router.get('/', function(req, res){
	res.json({message: 'Beer API is listening!'});
});

// create a new route with the prefix /beers
var beersRoute = router.route('/beers');
// Create a route with the /beers/:beer_id prefix
var beerRoute = router.route('/beers/:beer_id');


// Create endpoint /api/beers for POSTS
beersRoute.post(function(req, res) {
	// Create a new instance of the beers model
	var beer = new Beer();

// Set the beer properties that come from the POST'ed data
 beer.name = req.body.name;
 beer.type = req.body.type;
 beer.quantity = req.body.quantity;

// Save the POST'ed beer data and check for errors
beer.save(function(err) {
	if (err)
		res.send(err);
	
	res.json({ message: 'Beer added to the locker!', data: beer });
});
});


// Create endpoint /api/beers for GET
beersRoute.get(function(req, res){
	// use the Beer model to find all beer
	Beer.find(function(err, beers) {
		if (err)
			res.send(err);
		res.json(beers);
		
	})
	
})


// Create endpoint GET'ing a single beer
beerRoute.get(function(req, res){
	// Use the Beer model to find a specific beer
	// use the Mongoose Beer model function findByID()
	// then pass in the beer_id parameter to lookup requested beer
	Beer.findById(req.params.beer_id, function(err,beer){
		if (err)
			res.send(err);
		
		res.json(beer);
	})
})

// Create endpoint for PUT'ing a beer
beerRoute.put(function(req, res) {
	// Use the Beer model to find a specific beer
	Beer.findById(req.params.beer_id, function(err, beer){
		if (err)
			res.send(err);
		
 	// Update the existing beer quantity
		beer.quantity = req.body.quantity;
		
    // Save the beer and check for errors
		beer.save(function(err){
			if (err)
				res.send(err);
			
			res.json(beer);
		})
	})
})

// Create endpoint for DELETE'ing a beer
beerRoute.delete(function(req, res) {
	// User the Beer model to find a specific beer and remove it
	Beer.findByIdAndRemove(req.params.beer_id, function(err){
		if (err)
			res.send(err);
		
		res.json({ message: 'Beer removed from the locker'});
	})
})



// Register all our routes with /api 
app.use('/api', router);

//Start the server
app.listen(port);
console.log('Insert beer on port ' + port);



