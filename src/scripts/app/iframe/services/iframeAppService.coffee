angular.module('rally.app.iframe.services.appService', ['rally.app.iframe.services.messagebus']).service 'AppService',
	class IframeAppService

		@$inject = ['$window', '$messageBus']
		constructor: (@$messageBus) ->

		register: ($rootScope) =>
			@$messageBus.subscribe('*', (type, data) =>
				$rootScope.broadcast(type, data)
			)

