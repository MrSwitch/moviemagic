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

			//
			// Drag and drop
			//
			elms.find('.dropzone').on('drop', function(){
				alert(arguments);
			});

			scope.onDrop = function(item){
				scope.frames.push(item);
				scope.$apply();
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
.directive('timelineOnDrop', function(){
	return {
		restrict : 'A',
		scope : {
			timelineOnDrop : '='
		},
		link : function(scope, el, attrs){
			//elms.bind('drop', scope.onDrop );
			var id = angular.element(el).attr("id");
			if (!id) {
				id = (Math.random()*1e20).toString(36);
				angular.element(el).attr("id", id);
			}

			el.bind('drop', function(e){
				e.preventDefault();
				e.stopPropagation();
				var data = e.dataTransfer.getData("text");
				var dragEl = document.getElementById(data);
				var dropEl = document.getElementById(id);
				scope.timelineOnDrop( angular.element(dragEl).scope().item );
			});

			// by default elements can not be dropped into others
			el.bind('dragover', function(e){
				e.preventDefault();
			});
		}
	};
}).directive('draggable', function(){
	return {
		restrict : 'A',
		link : function(scope, el, attrs){
			var id = angular.element(el).attr("id");
			if (!id) {
				id = (Math.random()*1e20).toString(36);
				angular.element(el).attr("id", id);
			}
			el.bind("dragstart", function(e) {
				e.dataTransfer.setData('text', id);
            });
		}
	};
});