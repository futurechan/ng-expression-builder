angular.module('expression-builder', ['ui.bootstrap'])

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
		
		$scope.getLeftOperands=function($viewValue){
			return ($scope.leftOperandProvider)
				? $scope.leftOperandProvider($viewValue)
				: [];				
		}
		
		$scope.getRightOperands=function($viewValue){
			return ($scope.rightOperandProvider)
				? $scope.rightOperandProvider($viewValue)
				: [];		
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
				comparisonOperators: '=?',
				leftOperandProvider: '&',
				rightOperandProvider: '&'
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
						scope.booleanOperators = ['AND', 'OR', 'XOR'];
					
					if(scope.comparisonOperators === undefined)
						scope.comparisonOperators = ['=', '<>', '<', '<=', '>', '>=', '[]', '![]'];
					
					if(scope.leftOperandProvider)
						scope.leftOperandProvider = scope.leftOperandProvider()
					
					if(scope.rightOperandProvider)
						scope.rightOperandProvider = scope.rightOperandProvider()
				};
			}
		};
	})
	