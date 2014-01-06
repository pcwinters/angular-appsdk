'use strict';
app = angular.module 'rally'

class MainCtrl 

	constructor: (@$scope, $rally) ->
		$rally.bootstrap @$scope, @
		@$scope.$watch 'selectedProjectRef()', @onSelectedProjectRef


		@$scope.projectStore = Ext.create 'Rally.data.WsapiDataStore',
			model: 'Project'
			fetch: true
			listeners:
				load: @onProjectLoad


	onProjectLoad: (store, data, success) =>
		@$scope.project = data
		@$scope.$digest()

	onSelectedProjectRef: (projectRef) =>
		if projectRef?
			@$scope.projectStore.reload
				filters: [
					_ref: projectRef
				]

	selectedProjectRef: () =>
		value = @$scope.projectPicker?.getValue()
		return value


app.controller "MainCtrl", MainCtrl
