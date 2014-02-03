angular.module('rally.app.iframe.services.messagebus', []).service '$messageBus', 
	class IframeMessageBus

		@inject = ['$window']
		constructor: (@$window) ->
			@listeners = {}

		#
		# Publishes a message to this message bus.
		# @param {String} event Name of the event to publish
		# @param {Object...} varargs (optional) Optional objects to pass to the subscribers.
		#
		publish: (eventName, data) =>
			event = {eventName, data}
			@$window.parent.postMessage(event, "*")
			for listener in @listeners[eventName]
				listener.apply(@, [eventName, data])

		
		# subscribe to an event name
		subscribe: (eventName, listener) =>
			@register()
			@postToParent('iframe:subscribe', {name:eventName})
			@listeners[eventName] ?= []
			@listeners[eventName].push(listener)

		# Post a message to the iframe's parent window
		postToParent: (eventName, data) =>
			window.parent.postMessage({name: eventName, data:data}, '*')

		register: () =>
			if @registered then return
			@registered = true
			@$window.addEventListener("message", @onParentMessage, false)

		onParentMessage: ({source, data}) =>
			if @window isnt source
				@publish(data.name, data.data)