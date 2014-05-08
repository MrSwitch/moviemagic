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
				currentIndex += 1;
				scroll();
			};

			scope.prev = function(){
				// scroll right
				if(currentIndex>0){
					currentIndex -= 1;
				}
				scroll();
			};

			var scroll = function(){
				dropzone.style.marginLeft = - ( containerWidth * currentIndex) + "px";
			};

			// resize
			var resize = function(){
				// Set container width
				containerWidth = dropzone.offsetWidth;
				scroll();
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
				scope.timelineOnDrop( angular.element(dragEl).scope().item, scope.timelineDropIndex, scope.timelineDropReplace );
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