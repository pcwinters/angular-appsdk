
# app = angular.module('rally.component')

# class ComponentCtrl
# 	constructor: (@$scope, @$element, @$attrs, $rally) ->
# 		$rally.bootstrap @$scope, @
# 		@$scope.configs ?= {}

# 		configs = {}
# 		if @$attrs.renderTo or not @$attrs.add then configs.renderTo = $rally.xElement @$element
# 		@$scope.configs = _.extend @$scope.configs, configs
		
# 		@$scope.component = Ext.widget @$attrs.name, @$scope.options
# 		$rally.bind @$scope, @$scope.component
		

# 		# Expose this component on the parent scope?
# 		if @$attrs.bind?
# 			@$scope.$parent[@$attrs.bind] = @$scope.component
# 			# directives have isolate scope, bind to $parent to ensure digest
# 			$rally.bind @$scope.$parent, @$scope.component

# 		# Add this component to a parent container?
# 		if @$attrs.add?
# 			parent = @$attrs.add
# 			parent.add @$scope.component

# app.directive 'extComponent', () ->
# 	restrict: 'E'
# 	replace: true
# 	scope: {}
	
# 	controller: ComponentCtrl