###*
 * @ngdoc service
 * @name rally.api.services:$wsapi
 * @description
 * Abstracts $http calls to a wsapi base url. Can be configured at config/provider time to use a particular base url.
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rally.api.services.wsapi'])
						.config(function($wsapiProvider){
							$wsapiProvider.setBaseUrl('/test/');
						})
						.controller('Ctrl',
							function Ctrl($scope, $httpBackend, $wsapi) {
								$scope.$wsapi = $wsapi;
								console.log('backend', $httpBackend)
								console.log('backend.whenGET', $httpBackend.whenGET)
								$httpBackend.whenGET('/test/sub/url').respond(200, {foo: 'bar'});
								$wsapi({method: 'GET', url: '/sub/url/'}).then(function(data, status){
									$scope.data = data
									$scope.status = status
								});
							}
						);
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">
							<div>Wsapi base url: {{$wsapi.baseUrl}}</div>
							<div>data: {{data}}</div>
							<div>status: {{status}}</div>
						</div>
				</file>
		</example>
###
angular.module('rally.api.services.wsapi', [
	'rally.api.services.slm'
	'rally.util.http'
]).provider '$wsapi', ()->
	@baseUrl = '/webservice/v2.0/'
	@setBaseUrl = (@baseUrl)=>
	@$get = (rallyHttpWrapper, $slm)=>
		return rallyHttpWrapper(@baseUrl, $slm)
	return @
