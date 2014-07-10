function requestMarker(item) {
	$.getJSON('http://maps.google.com/maps/api/geocode/json?address=' + item.location, function(data) {
		if (typeof data.results[0] !== "undefined" 
			&& typeof data.results[0].geometry != "undefined" 
			&& typeof data.results[0].geometry.location != "undefined"
		) {
			
			var markerOptions = {
			    position: new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng),
			    title: "Oferta: (" + item.id + ") " + item.name
			};
						
			var marker = new google.maps.Marker(markerOptions);
			$(document).trigger('gotMarker', {marker: marker, item: item});
		}
	});
}

function createMap() {
	var mapOptions = {
		center: new google.maps.LatLng(51.9690921, 19.0830736),
		zoom: 6
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions);

	return map;
}




function initialize() {
	var socket = io();
	var map = createMap();

	socket.on('purchase', function(item) {
		requestMarker(item);

		$(document).on('gotMarker', function(event, obj) {
			obj.marker.setMap(map);
		});

		$('ul#items').prepend('<li><a href="https://allegro.pl/show_item.php?item=' + item.id + '" target="_blank">' + item.name + '</a> (' + item.location + ')</li>');
	});
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;