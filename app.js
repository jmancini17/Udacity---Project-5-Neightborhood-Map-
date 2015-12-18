var restaurants = [
	
	//Hard-coded restaurants to be filtered and searched for and their locations
	{
		name: "Ai Tre Scalini",
		latitude: 41.897175,
		longitude: 12.494829,
	},
	{
		name: "Da Enzo al 29",
		latitude: 41.888253,
		longitude: 12.477852,
	},
	{
		name: "Da Francesco",
		latitude: 41.899488,
		longitude: 12.470647,
	},
	{
		name: "Dar Poeta",
		latitude: 41.891410,
		longitude: 12.468990,
	},
	{
		name: "La Prosciutteria",
		latitude: 41.901910,
		longitude: 12.484521,
	},
	{
		name: "Hostaria Romana",
		latitude: 41.902474,
		longitude: 12.487247,
	},
	{
		name: "Pastasciutta",
		latitude: 41.904638,
		longitude: 12.458035,
	},
	{
		name: "Pinsere",
		latitude: 41.907540,
		longitude: 12.497750,
	},
	{
		name: "Tazza d'Oro",
		latitude: 41.899482,
		longitude: 12.477343,
	},
	{
		name: "Taverna Trilussa",
		latitude: 41.890630,
		longitude: 12.471430,
	}
];	

var viewModel = function(){
	
	var self = this;
	
	self.restaurantName = ko.observable();
	
	
	//markers are pushed to empty array after they are created, array can be looped over

	var markers = [];
	var searchButton = document.getElementById("search_button");
	var searchedRestaurant = document.getElementById("search_bar").value;
	
	//setting up the map and info window
	
	var map = new google.maps.Map(document.getElementById('google_map'), {
  	  center: {lat: 41.897102, lng: 12.485357}, 
 	   scrollwheel: false,
 	   zoom: 14
	});
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow();
	
	//loading the page initializes the map and automatically adds markers to each restaurant in the array

	function initMap() {

		for (var i = 0; i < restaurants.length; i++) {  
			addMarker(restaurants[i]);
		}
		
		//when a restaurant is searched, markers are cleared and the correct restaurant is identified
		//and gets a marker
		
		var filterRestaurants = function(e) {
			clearMarkers();
			addMarker(self.restaurantName());
			e.preventDefault();
		}
		
		
		
		// var filterRestaurants = function(e) {
		// 	clearMarkers();
		// 	for (var i = 0; i < restaurants.length; i++) {
		// 		if (document.getElementById("search_bar").value.toUpperCase() === restaurants[i].name.toUpperCase()) {
		// 			addMarker(restaurants[i]);
		// 		} else {
		// 			console.log("Cannot find restaurant");
		// 		}
		// 	}
		// 	e.preventDefault();
		// };
		
		//When a restaurant is clicked on in the list view, markers are cleared and the correct restaurant is identified
		//and gets a marker
		
		var filterRestaurantsFromList = function(e) {
			clearMarkers();
			for (var i = 0; i < restaurants.length; i++) {
				if (document.getElementsByClassName("restaurant_link")[i].childNodes[i].nodeValue === restaurants[i].name) {
					addMarker(restaurants[i]);
				} else {
					console.log("Failed to find restaurant")
				}
			}
			e.preventDefault();
		};
		
		//search button has an event listener to trigger the filterRestaurants function
	  
		searchButton.addEventListener("click", filterRestaurants);
		var restaurantsInListView = document.getElementsByClassName("restaurant_link");
	}
	
	//map is initialized
	
	initMap();
	
	//function to add marker onto restaurants using hard-coded latitude and longitude

	function addMarker(restaurant) {
		var marker = new google.maps.Marker({
			icon: "images/marker_rome.png",
			position: new google.maps.LatLng(restaurant.latitude, restaurant.longitude),
			map: map
		});
		
		//when marker is clicked, info window opens and animation for marker
	
		var markerListener = function() {
			infowindow.open(map, marker);
			marker.setAnimation(google.maps.Animation.BOUNCE);
			window.setTimeout(function() {
				marker.setAnimation(null);
			}, 2000);
			
			//API is called when marker is clicked, getting data for the clicked restaurant
			//Data is written into the info window 
		
			var foursquareURL = "https://api.foursquare.com/v2/venues/search?client_id=42HRMQSBPL43B4H22LZON2212KL0OS4EGUN0GQBYAS01253P&client_secret=GJ3ZMNOCIRQW31TZ1XFUXWOBZVKLQ1C3TC5S3NBQXGAAHBXE&v=20150321&ll=" + restaurant.latitude + "," + restaurant.longitude + "&intent=global&limit=1&query=" + restaurant.name;

			$.getJSON(foursquareURL, function(data) {
				console.log(data);
				var fsAddress1 = data.response.venues[0].location.formattedAddress[0];
				var fsAddress2 = data.response.venues[0].location.formattedAddress[1];
				var fsAddress3 = data.response.venues[0].location.formattedAddress[2];
				var fsURLs = data.response.venues[0].url;
				var fsName = data.response.venues[0].name;
				infowindow.setContent("<h5>" + fsName + "</h5><h5>" + fsAddress1 + "</h5><h5>" + fsAddress2 + "</h5><h5>" + fsAddress3 + "</h5><h5><a>" + fsURLs + "</a></h5");	
				if (!data.response.venues[0].url) {
					infowindow.setContent("<h5>" + fsName + "</h5><h5>" + fsAddress1 + "</h5><h5>" + fsAddress2 + "</h5><h5>" + fsAddress3 + "</h5><h5>Restraurant site not available</h5");
				};
				
				//error handling for if Foursquare API fails
				
			}).error(function(error) {
				infowindow.setContent("<h5>Foursquare information not available</h5>")
			});
		};
		
		//event listener added to the marker on click
		
		google.maps.event.addListener(marker, 'click', markerListener);
		
		//markers pushed to array after they are created by the addMarker function
		
		markers.push(marker);
	};
	
	function clearMarkers() {
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];
	}
};
  

var initializeListView = function() {
	for (var i = 0; i < restaurants.length; i++){
		var listItem = document.createElement("li");
		var list = document.getElementById("list_view");
		list.appendChild(listItem);
		var listAnchor = document.createElement("a");
		var anchorText = document.createTextNode(restaurants[i].name);
		listItem.appendChild(listAnchor);
		listAnchor.appendChild(anchorText);
		$(listAnchor).addClass("restaurant_link");
		
		var listItemEventListener = function(clickedRestaurant) {
			return function(e) {
				clearMarkers();
				addMarker(clickedRestaurant);
				e.preventDefault();
			};
		}(restaurants[i]);
		listItem.addEventListener("click", listItemEventListener);
	}
};

initializeListView();





viewModel();

ko.applyBindings(new viewModel());


	

