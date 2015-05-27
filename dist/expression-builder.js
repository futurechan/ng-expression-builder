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
			if($scope.staticLeftOperandProvider)
				return $scope.staticLeftOperandProvider();
			
			return ($scope.leftOperandProvider)
				? $scope.leftOperandProvider($viewValue)
				: [];				
		}
		
		$scope.getRightOperands=function($viewValue){
			if($scope.staticRightOperandProvider)
				return $scope.staticRightOperandProvider();
			
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
				staticLeftOperandProvider: '&',
				rightOperandProvider: '&',
				staticRightOperandProvider: '&'
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
					
					if(scope.staticLeftOperandProvider)
						scope.staticLeftOperandProvider = scope.staticLeftOperandProvider()
					
					if(scope.rightOperandProvider)
						scope.rightOperandProvider = scope.rightOperandProvider()
					
					if(scope.staticRightOperandProvider)
						scope.staticRightOperandProvider = scope.staticRightOperandProvider()
					
				};
			}
		};
	})
	
angular.module("expression-builder").run(["$templateCache", function($templateCache) {$templateCache.put("templates/expressionbuilder.html","<div class=condition-builder><div ng-repeat=\"c in conditions\"><div ng-if=\"$index != 0\" class=\"form-inline bool-op\"><select class=\"form-control input-sm\" ng-options=\"o as o for o in booleanOperators\" ng-model=c.bool></select></div><div ng-if=c.conditions class=condition-group><div class=pull-right><button class=\"btn btn-danger btn-sm\" ng-click=removeAt($index)>&times;</button></div><expression-builder conditions=c.conditions boolean-operators=booleanOperators comparison-operators=comparisonOperators left-operand-provider=leftOperandProvider static-left-operand-provider=staticLeftOperandProvider right-operand-provider=rightOperandProvider static-right-operand-provider=staticRightOperandProvider></expression-builder></div><div ng-if=!c.conditions class=form-inline><div class=form-group-sm><select class=form-control ng-if=staticLeftOperandProvider ng-model=c.leftOperand ng-options=\"operand for operand in getLeftOperands()\"></select><input class=form-control ng-if=!staticLeftOperandProvider ng-model=c.leftOperand placeholder=\"Left Operand\" typeahead=\"operand for operand in getLeftOperands($viewValue)\"><select class=form-control ng-model=c.comparison ng-options=\"o as o for o in comparisonOperators\"></select><select class=form-control ng-if=staticRightOperandProvider ng-model=c.rightOperand ng-options=\"operand for operand in getRightOperands()\"></select><input class=form-control ng-if=!staticRightOperandProvider ng-model=c.rightOperand placeholder=\"Right Operand\" typeahead=\"operand for operand in getRightOperands($viewValue)\"> <button class=\"btn btn-danger btn-sm\" ng-click=removeAt($index)>&times;</button></div></div></div><div class=condition-group-button-row><button class=\"btn btn-default btn-sm\" ng-click=addCondition()><span class=\"glyphicon glyphicon-plus-sign\"></span> Add Condition</button> <button class=\"btn btn-default btn-sm\" ng-click=addGroup()><span class=\"glyphicon glyphicon-plus-sign\"></span> Add Group</button></div></div>");}]);