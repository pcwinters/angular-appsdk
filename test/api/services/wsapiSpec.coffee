describe 'rally.api.services.wsapi', ->

	describe '$wsapiProvider', ->
		beforeEach ->
			testModule = angular.module('test.rally.api.services.wsapi', ['rally.api.services.wsapi']).config (@$slmProvider, @$wsapiProvider) =>
				@$slmProvider.setBaseUrl('/slm/')
				@$wsapiProvider.setBaseUrl('wsapi/')
			angular.mock.module('rally.api.services.wsapi', 'test.rally.api.services.wsapi')
		
		it 'should append my request to the slm url', inject ($wsapi, $httpBackend)->
			$httpBackend.expectGET('/slm/wsapi/query').respond(200)
			$wsapi.get('query')
			$httpBackend.flush()
