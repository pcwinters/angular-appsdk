angular.module('rally.app.services.rally', ['Ext', 'Rally']).service '$rally',	
	class RallyAppService
		
		constructor: (@$q, @$rootScope, @$log, @Ext, @Rally) ->

		launchApp: (appName, options={}, scope=@$rootScope) =>
			deferred = @$q.defer()
			self = @
			defaults = 
				extend: 'Rally.app.App'
				launch: ->				
			options = _.extend(defaults, options)
			
			# Wrap the launch function to bind events and resolve the promise
			options.launch = _.wrap options.launch, (fn, args...)->
				# @ is the app reference from the launch function
				fn.apply(@, args)
				self.bind(scope, @)
				deferred.resolve(@)

			theApp = @Ext.define appName, options
			@Rally.launchApp appName
			return deferred.promise

		# Bind all events of an Ext Observable to scope digest()
		bind: (scope, observable) =>
			@$log.debug 'Binding to Rally app events'
			Ext.util.Observable.capture observable, (name, args...) =>
				@$log.debug "rally event: #{name} ", args...
				scope.$emit name, args...
				if !scope.$$phase
					scope.$digest()

			return observable
