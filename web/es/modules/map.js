import mapsapi from 'google-maps-api';
// import _ from 'lodash';
import $ from 'jquery';
import compass from 'ai/compass.js';


compass.needGPS(function() {
	$('#status').prepend("$('.go-outside-message').show(); // Step 1: we need GPS signal");
}).needMove(function() {
	$('#status').prepend("$('.go-outside-message').hide()");
	$('#status').prepend("$('.move-and-hold-ahead-message').show(); // Step 2: user must go forward");
}).init(function() {
	$('#status').prepend("$('.move-and-hold-ahead-message').hide(); // GPS hack is enabled");
});

compass.noSupport(function () {
  $('#status').html('FULL OF NOPE');
});


let maps = mapsapi('AIzaSyDqNeeDJkEZpnZ3njeFtIzuFgpDYWzBTVw')();
let steps = [];
let watchId = null;
let currentHeading = 0

maps.then(() => {
	navigator.geolocation.getCurrentPosition((position) => {
		let origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		let map = new google.maps.Map(document.getElementById('map'), {
			center: origin,
			zoom: 13
		});

		let clubMateLocations = [
			new google.maps.LatLng(60.1801209, 25.0527446),
			new google.maps.LatLng(60.1814789, 24.9252977)
		];
		getClosest(origin, clubMateLocations, (closestClubMate) => {

			let directions = new google.maps.DirectionsService();

			directions.route({
				origin: origin,
				destination: closestClubMate,
				travelMode: google.maps.TravelMode.WALKING
			}, (res, ok) => {
				steps = [];
				res.routes[0].legs.map((leg) => {
					leg.steps.map((step) => {
						steps.push(step);
					});
				});
				if (!watchId) {
					navigator.geolocation.watchPosition(watchPos);
					watchId = compass.watch(updateHeading);
					window.addEventListener('deviceorientation', updateOrientation);
					window.addEventListener('deviceorientation', updateOrientation);
				}


			});

		});

	});
});


function watchPos(position) {
	let currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	console.log('=>', currentPosition);
	$('#status').prepend(currentPosition.toString() + '<br />');

	console.log(getBearing(
		position.coords.latitude,
		position.coords.longitude,
		steps[0].start_location.lat(),
		steps[0].start_location.lng()
	));

}

function getClosest(origin, destinations, callback) {
	let distanceMatrix = new google.maps.DistanceMatrixService();
	distanceMatrix.getDistanceMatrix({
		origins: [origin],
		destinations: destinations,
		travelMode: google.maps.TravelMode.WALKING
	}, (res) => {
		let distance = -1;
		let closest = -1;
		res.rows[0].elements.map((item, i) => {
			if (distance == -1 || distance > item.distance.value) {
				distance = item.distance.value;
				closest = i;
			}
		});

		callback(destinations[closest]);

	});
}

function updateHeading(heading) {
	currentHeading = heading;
	// $('#status').html('' + currentHeading);
}

function updateOrientation (e) {
	$('#status').html('' + e.alpha);
}

function getBearing(originLat, originLon, destinationLat, destinationLon) {
	var y = Math.sin(destinationLon - originLon) * Math.cos(destinationLat);
	var x = Math.cos(originLat) * Math.sin(destinationLat) - Math.sin(originLat) * Math.cos(destinationLat) * Math.cos(destinationLon - originLon);
	return Math.atan2(y, x) * 57.2958;
}

/*

var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin2 = "Greenwich, England";
var destinationA = "Stockholm, Sweden";
var destinationB = new google.maps.LatLng(50.087692, 14.421150);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    transitOptions: TransitOptions,
    unitSystem: UnitSystem,
    durationInTraffic: Boolean,
    avoidHighways: Boolean,
    avoidTolls: Boolean,
  }, callback);

function callback(response, status) {
  // See Parsing the Results for
  // the basics of a callback function.
}

*/
