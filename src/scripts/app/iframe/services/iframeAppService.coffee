angular.module('rally.app.iframe.services.appService', ['rally.app.iframe.services.messagebus']).service 'AppService',
	class IframeAppService

		@$inject = ['$messageBus']
		constructor: (@$messageBus) ->

		register: ($rootScope) =>
			@$messageBus.subscribe('objectupdate', (type, data) =>
				$rootScope.broadcast(type, data)
			)

