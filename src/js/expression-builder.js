angular.module('expression-builder', [])

	.controller('ExpressionBuilderController', function($scope){
		
		$scope.addCondition=function(){
			$scope.conditions.push({});
		}
		
		$scope.addGroup=function(){
			$scope.conditions.push({conditions:[]});
		}
		
		$scope.remove=function(c){
			var idx = $scope.conditions.indexOf(c);
			
			$scope.removeAt(idx);
		}
		
		$scope.removeAt=function(idx){
			$scope.conditions.splice(idx,1);
		}
	})
	
	.directive('expressionBuilder', function($compile){
		
		return {
			restrict:'EA',
			controller:'ExpressionBuilderController',			
			templateUrl: 'templates/expressionbuilder.html',
			scope: {
				conditions: '=',
				booleanOperators: '=?',
				comparisonOperators: '=?'
			},
			compile: function (element) {
				var contents = element.contents().remove();
				var contentsLinker;

				return function (scope, iElement) {
					if (angular.isUndefined(contentsLinker)) {
						contentsLinker = $compile(contents);
					}

					contentsLinker(scope, function (clonedElement) {
						iElement.append(clonedElement);
					});
					
					if(scope.booleanOperators === undefined)
						scope.booleanOperators = ['AND', 'OR', 'AND NOT', 'XOR'];
					
					if(scope.comparisonOperators === undefined)
						scope.comparisonOperators = ['=', '<>', '<', '<=', '>', '>='];
				};
			}
		};
	})