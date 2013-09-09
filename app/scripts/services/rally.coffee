class RallyService

	app: (appName, extend='Rally.app.app') =>
		debugger
		if @_app? then return @_app
		@_app = Ext.define appName,
			extend: extend,
			launch: () ->
				console.log 'launched app'
		Rally.launchApp appName,
			name: appName

	# Bind all events of an Ext Observable to scope digest()
	bind: (scope, observable) =>
		Ext.util.Observable.capture observable, () ->
			if not !scope.$$phase
				scope.$digest()
		return observable

	# Attach all public methods to the scope.
	bootstrap: (scope, controller) => 
		allMethods = _.methods(controller)
		publicMethods = _.omit (property) -> property.slice(0,1) is '_'
		for methodName in publicMethods
			scope[methodName] = controller[methodName]

	xElement: ($element) =>
		return Ext.get $element[0]


app = angular.module 'rally.service'
app.factory '$rally', () -> new RallyService