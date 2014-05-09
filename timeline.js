//
// Timelines is a collection of 
angular.module('timeslides')
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

			scope.onDrop = function(item, index, replace){
				// insert into position defined by index
				if(index===undefined){
					// add to the end
					scope.frames.push(item);
				}
				else{
					scope.frames.splice(index, ~~replace, item);
				}
				scope.$apply();
			};

			//
			// Navigation
			// 
			var currentIndex = 0,
				containerWidth,
				dropzone = elms[0].querySelector('.dropzone');

			scope.next = function(){
				// scroll left
				scroll(1);
			};

			scope.prev = function(){
				// scroll right
				scroll(-1);
			};

			var scroll = function(direction){
				dropzone.scrollLeft += ( containerWidth * direction);
			};

			// resize
			var resize = function(){
				// Set container width
				containerWidth = dropzone.offsetWidth;
			};

			window.addEventListener('resize', resize);

			resize();

		}
	};
})
.directive('timelineOnDrop', function(){
	return {
		restrict : 'A',
		scope : {
			frames : '=',
			timelineOnDrop : '=',
			timelineDropIndex : '=',
			timelineDropReplace : '='
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

				el.removeClass('dragenter');

				var data = e.dataTransfer.getData("text");
				var dragEl = document.getElementById(data);

				var item = angular.element(dragEl).scope().item;

				var index = scope.frames.indexOf(item);
				if( index === -1 ){
					// Is this coming from outside?
					scope.timelineOnDrop( angular.copy(item), scope.timelineDropIndex, scope.timelineDropReplace );
				}
				else{

					// remove from its original position
					scope.frames.splice(index, 1);
					
					scope.frames.splice(scope.timelineDropIndex, 0, item);
					scope.$apply();
				}
			});

			// by default elements can not be dropped into others
			el.bind('dragover', function(e){
				el.addClass('dragenter');
				e.preventDefault();
			});
			el.bind('dragenter', function(e){
				el.addClass('dragenter');
				e.preventDefault();
			});
			el.bind('dragleave', function(e){
				el.removeClass('dragenter');
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
}).directive('timelineDiscard', function(){
	return {
		restrict : 'A',
		link : function(scope, el, attrs){

			el.bind('drop', function(e){
				e.preventDefault();
				e.stopPropagation();

				el.removeClass('dragenter');

				var data = e.dataTransfer.getData("text");
				var dragEl = document.getElementById(data);
				var index = scope.frames && scope.frames.indexOf( angular.element(dragEl).scope().item );
				if(index>-1){
					scope.frames.splice(index,1);
					scope.$apply();
				}
			});

			// by default elements can not be dropped into others
			el.bind('dragover', function(e){
				e.preventDefault();
			});
			el.bind('dragenter', function(e){
				el.addClass('dragenter');
				e.preventDefault();
			});
			el.bind('dragleave', function(e){
				el.removeClass('dragenter');
				e.preventDefault();
			});
		}
	};
});