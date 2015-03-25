'use strict';

angular.module('angularRestfulAuth')
	.directive('tasksBlock', function() {
		  return {
		  	restrict: 'E',
		    templateUrl: '../partials/tasks-block.html'
		  };
	})
	.directive('listsBlock', function() {
		return {
			restrict: 'E',
			templateUrl: '../partials/lists-block.html'
		}
	})
	.directive('taskInfoBlock', function() {
		return {
			restrict: 'E',
			templateUrl: '../partials/task-info-block.html'
		}
	});