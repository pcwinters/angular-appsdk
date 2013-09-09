
app = angular.module('rally.component')

class ComponentCtrl
	constructor: (@$scope, @$element, @$attrs, $rally) ->
		$rally.bootstrap @$scope, @
		@$scope.options ?= {}

		options = 
			renderTo: $rally.xElement @$element
		@$scope.options = _.extend @$scope.options, options
		
		@$scope.component = Ext.widget @$attrs.name, @$scope.options
		$rally.bind @$scope, @$scope.component
		
		if @$attrs.bind?
			@$scope.$parent[@$attrs.bind] = @$scope.component
			# directives have isolate scope, bind to $parent to ensure digest
			$rally.bind @$scope.$parent, @$scope.component

app.directive 'extComponent', () ->
	restrict: 'E'
	replace: true
	scope: {}
	
	controller: ComponentCtrl