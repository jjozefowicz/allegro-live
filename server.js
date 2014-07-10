var express = require('express');
var server = express();
var http = require('http').Server(server);
var socket = require('socket.io')(http);

var events = require('events');
var emitter = new events.EventEmitter();

var allegro = require('./libs/allegro/lib/allegro');
var allegroOptions = {
	login: '',
	password: '',
	key: ''
};

server.use(express.static(__dirname + '/public'));


server.get("/", function(req, res) {
	res.sendfile('views/index.html');
});


allegro.createClient(allegroOptions, function (err, client) {
	client.on('buynow', function (itemId) {
	    client.getItem(itemId, function(err, item) {
	    	emitter.emit('itemPurchased',  {
	    		location: item.location, 
	    		id: item.id, 
	    		name: item.name
	    	});
	    });
	});
});

socket.on('connection', function(incomingSocket) {
	emitter.on('itemPurchased', function(item) {
		socket.emit('purchase', item);
	});
});

http.listen(3000, function() {
});