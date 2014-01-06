angular.module('rally.services.rally', ['Ext', 'Rally']).service '$rally',
	
	class RallyService
		
		@$inject = ['Ext', 'Rally']
		constructor: (@Ext, @Rally) ->

		launchApp: (appName, options={}, scope=null) =>
			self = @
			defaults = 
				extend: 'Rally.app.app'
			if scope
				defaults.launch = () ->
					self.bind(scope, @)
			options = _.extend(defaults, options)

			theApp = @Ext.define appName, options
			@Rally.launchApp appName		

		# Bind all events of an Ext Observable to scope digest()
		bind: (scope, observable) =>
			Ext.util.Observable.capture observable, (name, args...) ->
				scope.$emit name, args...
				if !scope.$$phase
					scope.$digest()

			return observable
