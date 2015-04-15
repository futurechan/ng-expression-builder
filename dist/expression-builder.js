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
	
angular.module("expression-builder").run(["$templateCache", function($templateCache) {$templateCache.put("templates/expressionbuilder.html","<div class=condition-builder><div ng-repeat=\"c in conditions\"><div ng-if=\"$index != 0\" class=\"form-inline bool-op\"><select class=\"form-control input-sm\" ng-options=\"o as o for o in booleanOperators\" ng-model=c.bool></select></div><div ng-if=c.conditions class=condition-group><div class=pull-right><button class=\"btn btn-danger btn-sm\" ng-click=removeAt($index)>&times;</button></div><expression-builder conditions=c.conditions boolean-operators=booleanOperators comparison-operators=comparisonOperators left-operand-provider=leftOperandProvider right-operand-provider=rightOperandProvider></expression-builder></div><div ng-if=!c.conditions class=form-inline><div class=form-group-sm><input class=form-control ng-model=c.leftOperand placeholder=\"Left Operand\" typeahead=\"operand for operand in getLeftOperands($viewValue)\"><select class=form-control ng-model=c.comparison ng-options=\"o as o for o in comparisonOperators\"></select><input class=form-control ng-model=c.rightOperand placeholder=\"Right Operand\" typeahead=\"operand for operand in getRightOperands($viewValue)\"> <button class=\"btn btn-danger btn-sm\" ng-click=removeAt($index)>&times;</button></div></div></div><div class=condition-group-button-row><button class=\"btn btn-success btn-sm\" ng-click=addCondition()>Add Condition</button> <button class=\"btn btn-success btn-sm\" ng-click=addGroup()>Add Group</button></div></div>");}]);