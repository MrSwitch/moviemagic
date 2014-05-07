//
// Timelines is a collection of 
angular.module('timeslides', [])
.directive('timeline', function() {
	return {
		restrict: 'E',
		replace:true,
		transclude: true,
		scope : {
			frames : '=',
			selected : '='
		},
		templateUrl: 'timeline.html',
		link : function(scope, elms, attrs){

			console.log(scope, elms, attrs);

			//
			// Drag and drop
			//
			elms.find('.dropzone').on('drop', function(){
				alert(arguments);
			});

			scope.onDrop = function(e){
				console.log(e);
			};

			//
			// Navigation
			// 
			scope.currentIndex = 1;

			scope.next = function(){
				// scroll left
				scope.currentIndex += 1;
			};

			scope.prev = function(){
				// scroll right
				scope.currentIndex -= 1;
			};


		}
	};
})
.directive('onDrop', function(){
	return {
		restrict : 'A',
		link : function(scope, elms, attrs){
			scope.onDrop = function(){
				alert(arguments);
			};
		}
	};
});