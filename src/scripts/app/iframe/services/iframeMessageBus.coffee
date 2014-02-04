angular.module('rally.app.iframe.services.messageBus', ['rally.app.iframe.decorators.rootScope']).service '$messageBus', 
	class IframeMessageBus

		@inject = ['$window', '$rootScope']
		constructor: (@$window, @$rootScope) ->
			@$window.addEventListener("message", @onParentMessage, false)
			@$rootScope.$on('*', @onScopeMessage)

		onScopeMessage: (wildcard, eventName, args...) =>
			if eventName.indexOf("rally:") is 0
				eventName = eventName.replace("rally:","")
				event = {name:eventName, args:args}
				@$window.parent?.postMessage(event, "*")

		onParentMessage: (event) =>
			{source, data} = event
			name = "rally:#{data.name}"
			args = [name].concat(data.args)
			@$rootScope.$broadcast.apply(@$rootScope, args)
