var express = require('express');
var server = express();
var http = require('http').Server(server);
var socket = require('socket.io')(http);

var events = require('events');
var emitter = new events.EventEmitter();

var allegro = require('allegro');
var allegroOptions = {
	login: '',
	password: '',
	key: ''
};

// Proxy staticfiles
server.use(express.static(__dirname + '/public'));

// Send index.html
server.get("/", function(req, res) {
	res.sendfile('views/index.html');
});

// Get allegro client, and emit event after item is purchased
allegro.createClient(allegroOptions, function (err, client) {
	client.on('buynow', function (itemId) {
	    client.getItem(itemId, function(err, item) {
	    	if (err) {
	    		console.log("Item id: " + itemId + " error: " + err);
	    		return;
	    	}

	    	emitter.emit('itemPurchased',  {
	    		location: item.location, 
	    		id: item.id, 
	    		name: item.name
	    	});
	    });
	});
});

// When item is purchased send info to connected clients
emitter.on('itemPurchased', function(item) {

	// Push event to client
	socket.emit('purchase', item);
});

http.listen(3000);