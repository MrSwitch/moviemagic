var API_ENDPOINT = 'http://ec2-54-79-170-49.ap-southeast-2.compute.amazonaws.com/';

angular.module('timeslides', ['ngRoute'])

.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/movie/:id', {
          templateUrl: 'submit.html',
          controller: 'submitController'
        });
  }])

.controller('app', ['$scope', '$http', '$location', function ($scope, $http, $location){

	// Preload the search from the search query
	$scope.url = $location.search().url;

	// Define a function for finding the images available from the API
	$scope.findImages = function(){

		/*
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

		/*/
		// CORS ERROR
		$http.get( API_ENDPOINT + 'findimages?url=' + $scope.url).success( function(response){
			angular.forEach(response.results, function(item){
				$scope.images.push({
					image : item,
					text : ""
				});
			});
		});
		/**/
	};

	// Load up initial search
	if( $scope.url ){
		$scope.findImages();
	}

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

		$http.post( API_ENDPOINT, body).success( function(data){
			// Once the post has returned, lets direct the user to their page
			$location.path('/movie/'+data);
			$scope.$apply();
		}).error(function(){
			// example
			$location.path('/movie/error');
			$scope.$apply();
		});
	};

}])

.controller('submitController', ['$scope','$routeParams', '$sce', function($scope,$routeParams,$sce){

	var path = $routeParams.id!=='error' ? $routeParams.id +'/index.html' : '';
	$scope.url = $sce.trustAsResourceUrl( API_ENDPOINT + path );

}])

.directive('popup', function(){
	return {
		restrict: 'E',
		replace:true,
		transclude: true,
		template : '<div class="popup"><a href="#" class="close"></a><section ng-transclude></section></div>'
	};
})


.directive('share', function(){

	return {
		restrict: 'E',
		replace:true,
		scope:{
			url:'@url',
			message:'@message'
		},
		template : '<div><button class="fa fa-twitter"></button><button class="fa fa-facebook"></button></div>',
		link : function(scope, el, attrs){
			el.bind('click', function(e){
				var service = e.target.className.match(/\bfa-(.+?)\b/)[1];
				var url = {
					'twitter' : 'http://twitter.com/share?url=' + encodeURIComponent(scope.url) + '&text=' + scope.message,
					'facebook' : 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(scope.url) + '&t=' + scope.message
				}[service];
				var w = 500, h = 500;
				var W = document.documentElement.offsetWidth,
					H = document.documentElement.offsetHeight;
				var l = (W - w)/2,
					t = (H - h)/2;
				window.open( url, '_blank', 'resizable=true,location=true,width='+w+',height='+h+',left='+l+',top='+t);
			});
		}
	};
});