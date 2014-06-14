# Decorator that supports a mechanism for wildcard listeners
angular.module('rally.app.iframe.decorators.rootScope', []).config ($provide) ->
	$provide.decorator '$rootScope', ($delegate) ->
		$emit = $delegate.__proto__.$emit
		$delegate.__proto__.$emit = (name, args...) ->
			$emit.apply(@, arguments)
			$emit.apply(@, ['*', name].concat(args))
		return $delegate
