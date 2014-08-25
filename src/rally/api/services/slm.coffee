###*
 * @ngdoc service
 * @name rally.api.services:$slm
 * @description
 * @example	
###
angular.module('rally.api.services.slm', [
	'rally.util.http'
]).provider '$slm', ()->
	@baseUrl = '/slm/'
	@setBaseUrl = (@baseUrl)=>
	@$get = (rallyHttpWrapper)=>
		return rallyHttpWrapper(@baseUrl)
	return @
