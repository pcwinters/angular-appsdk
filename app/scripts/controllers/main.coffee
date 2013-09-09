'use strict';
app = angular.module 'rally'

class MainCtrl 

	constructor: (@$scope, $rally) ->
		$rally.bootstrap @$scope, @

app.controller "MainCtrl", MainCtrl
