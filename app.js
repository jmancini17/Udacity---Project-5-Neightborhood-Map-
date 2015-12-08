var restaurants = [
	{
		name: "Old Bear",
		latitude: 41.901662,
		longitude: 12.473234,
		address: "Via dei Gigli D'Oro, 3, 00186 Rome, Italy",
		url: "http://www.yelp.com/biz/old-bear-roma",
	},
	{
		name: "La Botticella",
		latitude: 41.890144,
		longitude: 12.468270,
		address: "Vicolo del Leopardo 39A 00153 Rome Italy",
		url: "http://www.yelp.com/biz/la-botticella-roma",
	},
	{
		name: "Panino Divino",
		latitude: 41.906896,
		longitude: 12.458347,
		address: "Via dei Gracchi 11, 00192 Rome, Italy",
		url: "http://www.yelp.com/biz/panino-divino-roma",
	},
	{
		name: "Pastasciutta",
		latitude: 41.904638,
		longitude: 12.458035,
		address: "Via delle Grazie 5, 00193 Rome, Italy",
		url: "http://www.yelp.com/biz/pastasciutta-roma",
	},
	{
		name: "Da Francesco",
		latitude: 41.899488,
		longitude: 12.470647,
		address: "Piazza del Fico 29, 00186 Rome, Italy",
		url: "http://www.yelp.com/biz/da-francesco-roma?osq=dinner",
	},
	{
		name: "Osteria Barberini",
		latitude: 41.904433,
		longitude: 12.487523
	},
	{
		name: "Pastificio",
		latitude: 41.906396,
		longitude: 12.480928
	},
	{
		name: "Scilla e Feridi",
		latitude: 41.897102,
		longitude: 12.485357
	},
	{
		name: "Pinsere",
		latitude: 41.907540,
		longitude: 12.497750
	},
	{
		name: "Ristochiccio",
		latitude: 41.903663,
		longitude: 12.462208
	},
	{
		name: "La Prosciutteria",
		latitude: 41.901910,
		longitude: 12.484521
	},
	{
		name: "Ai Tre Scalini",
		latitude: 41.897175,
		longitude: 12.494829
	}
];		

var markers = [];
var map = new google.maps.Map(document.getElementById('google_map'), {
  center: {lat: 41.897102, lng: 12.485357}, 
  scrollwheel: false,
  zoom: 14
});
var bounds = new google.maps.LatLngBounds();
var infowindow = new google.maps.InfoWindow();

function initMap() {

  for (var i = 0; i < restaurants.length; i++) {  
    addMarker(restaurants[i]);
  }

  var filterRestaurants = function(e) {
	clearMarkers();
    for (var i = 0; i < restaurants.length; i++) {
      if (document.getElementById("search_bar").value.toUpperCase() === restaurants[i].name.toUpperCase()) {
		addMarker(restaurants[i]);
	  } else {
        console.log("Cannot find restaurant");
      }
  	}
	e.preventDefault();
  };
  
  var filterRestaurantsFromList = function(e) {
    clearMarkers();
	for (var i = 0; restaurants.length; i++) {
	  if (document.getElementsByClassName("restaurant_link")[i].childNodes[i].nodeValue === restaurants[i].name) {
		addMarker(restaurants[i]);
	  } else {
	  	console.log("Failed to find restaurant")
	  }
	    }
	e.preventDefault();
	  };
	
  searchButton.addEventListener("click", filterRestaurants);
  
  var restaurantsInListView = document.getElementsByClassName("restaurant_link");

  var filterListView = function() {
	for (var i = 0; i < restaurantsInListView.length; i++) {
		restaurantsInListView[i].addEventListener('click', filterRestaurantsFromList);
	}
  }
  filterListView();
};

function addMarker(restaurant) {
  var marker = new google.maps.Marker({
	position: new google.maps.LatLng(restaurant.latitude, restaurant.longitude),
    map: map
  });
  
  var markerListener = function() {
    infowindow.setContent(restaurant.name);
    infowindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
      marker.setAnimation(null);
    }, 2000);
  };
  google.maps.event.addListener(marker, 'click', markerListener);
  markers.push(marker);
  
  }

var initializeListView = function() {
  for (var i = 0; i < restaurants.length; i++){
	  console.log("Hi");
    var listItem = document.createElement("li");
	var list = document.getElementById("list_view");
	list.appendChild(listItem);
	var listAnchor = document.createElement("a");
	var anchorText = document.createTextNode(restaurants[i].name);
	listItem.appendChild(listAnchor);
	listAnchor.appendChild(anchorText);
	$(listAnchor).addClass("restaurant_link");
  }
};

initializeListView();

function clearMarkers() {
  markers.forEach(function(marker) {
	marker.setMap(null);
  });
  markers = [];
}

  
var searchButton = document.getElementById("search_button");
var searchedRestaurant = document.getElementById("search_bar").value.toUpperCase();


var generateContentString = function (nameLocation) {
 var nameLocation = nameLocation;
 var location = "Roma";
 var consumerKey = "CONSUMER KEY";
 var consumerKeySecret = "CONSUMER KEY SECRET"
 var token = "TOKEN"
 var tokenSecret = "TOKEN SECRET";

/*
 * Get yelp Info 
 */

   function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
  }

  var yelp_url = "http://api.yelp.com/v2/search?term=food&location=Roma&oauth_consumer_key=CONSUMER KEY&oauth_token=TOKEN&oauth_signature_method=HMAC-SHA1&oauth_signature=SIGNATURE&oauth_timestamp=1449604258&oauth_nonce=679571719&oauth_version=1.0";
 

  var parameters = {
    oauth_consumer_key: CONSUMER KEY,
    oauth_token: TOKEN,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb',
    term: term,
    location: location,
    limit: 1
  }
};

var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, CONSUMER KEY, CONSUMER SECRET, TOKEN SECRET);
parameters.outh_signature = encodedSignature;
var settings =  {
     url: yelp_url,
	 data: parameters,
	 cache: true,
	 dataType: 'jsonp',
	 success: function(results) {
	           console.log("yelp success");
	 },
	 error: function() {
	       console.log("error");
	}
};
	 $.ajax(settings);


initMap();


	

