describe 'rally.api.services.lookback', ->

	describe '$lookbackProvider', ->
		beforeEach ->
			testModule = angular.module('test.rally.api.services.lookback', ['rally.api.services.lookback']).config (@$lookbackProvider) =>
				@$lookbackProvider.setBaseUrl('/analytics')
			angular.mock.module('rally.api.services.lookback', 'test.rally.api.services.lookback')
		
		it 'should post a query to the lookback API', inject ($lookback, $httpBackend)->
			$httpBackend.expectPOST('/analytics/workspace/123/artifact/snapshot/query', (body) =>
				return body == '{"find":{"$pleaseDontFilterMe":"test"}}'
			).respond(200)
			find = { $pleaseDontFilterMe: 'test' }
			$lookback.artifactSnapshots(123, {find})
			$httpBackend.flush()
