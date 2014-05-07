var API_ENDPOINT = 'http://ec2-54-79-170-49.ap-southeast-2.compute.amazonaws.com/';


function app($scope, $http){


	// Define a function for finding the images available from the API
	$scope.url = 'http://www.news.com.au/world/oscar-pistorius-accused-of-making-very-sinister-remark-denies-asking-state-witness-how-can-you-sleep-at-night/story-fndir2ev-1226908098389';

	$scope.findImages = function(){

		$http.get("http://proxy-server.herokuapp.com/" + $scope.url).success( function(text){

			// Find all the images in the page
			// Add those images to the array
			
			var reg = /<img (data\-)?src\=(\"|\')(.*?)(\2)/g;

			while( (m = reg.exec(text)) ){
				$scope.images.push({
					image : m[3],
					text : ""
				});
			}
		});

		/* CORS ERROR	
		$http.get( API_ENDPOINT + 'findimages?url=' + $scope.url).success( function(text){
			$scope.images = JSON.parse(text);
		});
		*/
	};


	// Contains a list of images which can be dropped into a theme
	$scope.images = [];

	// Add to Timeline
	$scope.addToTimeline = function( item, x ){
		// Insert the item into the timeline at position X
		$scope.timeline.splice( x||-0, 0, item );
	};

	// Timeline
	// A collection of media assets in a chronological order
	$scope.timeline = [];


	// Submit
	// Send the item to the server and creates
	$scope.submit = function(){

		var body = angular.toJson($scope.timeline);

		$http.post( API_ENDPOINT, body, function(e){
			// 
			console.log(e);
		});
	};

}