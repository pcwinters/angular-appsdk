
app = angular.module('rally.component')

class ComponentCtrl
	constructor: (@$scope, @$element, @$attrs, $rally) ->
		$rally.bootstrap @$scope, @
		@$scope.options ?= {}
		@$scope.options.renderTo ?= @$element
		
		
		component = Ext.widget @$attrs.name,
			html: 'Hello World'
			renderTo: $rally.xElement @$element
		#$rally.app().add component
		@$scope.component = $rally.bind @$scope, component #@$scope.type, @$scope.options

app.directive 'rlyComponent', () ->
	restrict: 'E'
	scope: {}
		# Required for multi-select mode; ignored in single-select mode.
		#options: "="
	
	controller: ComponentCtrl