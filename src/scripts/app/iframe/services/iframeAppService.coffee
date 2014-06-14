angular.module('rally.app.iframe.services.appService', ['rally.app.iframe.services.messagebus']).service 'AppService',
	class IframeAppService

		@$inject = ['$rootScope', '$messageBus']
		constructor: (@$rootScope, @$messageBus) ->

		register: (appName) =>
			@$rootScope.$broadcast('iframe:appRegister', appName)
