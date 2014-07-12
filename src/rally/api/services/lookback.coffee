###*
 * @ngdoc service
 * @name rally.api.services:$lookback
 * @description
 * @example	
###
angular.module('rally.api.services.lookback', [
]).provider '$lookback', () ->
	@baseUrl = '/analytics/v2.0/service/rally'
	@setBaseUrl = (@baseUrl)=>

	class LookbackApi
		constructor: (@$http, @baseUrl) ->

		artifactSnapshots: (workspaceOid, query, config) =>
			# Must use JSON.stringify, angular.toJson removes keys with $, which are kind of important in lookback queries :)
			return @$http.post("#{@baseUrl}/workspace/#{workspaceOid}/artifact/snapshot/query", JSON.stringify(query), config)

	@$get = ($http) =>
		return new LookbackApi($http, @baseUrl)
	return @
