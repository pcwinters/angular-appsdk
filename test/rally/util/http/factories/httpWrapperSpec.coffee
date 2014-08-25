describe 'rally.util.http.factories.httpWrapper.rallyHttpWrapper', ->

	beforeEach angular.mock.module 'rally.util.http.factories.httpWrapper'
	beforeEach inject (@rallyHttpWrapper, @$httpBackend)->

	beforeEach ->
		@composition = @rallyHttpWrapper('/baseUrl/')
	afterEach ->
		@$httpBackend.flush()

	it 'should append my request to the base url', ->
		@$httpBackend.expectGET('/baseUrl/query').respond(200)
		@composition({method: 'GET', url: 'query'})		

	it 'should remove double slashes', ->
		@$httpBackend.expectGET('/baseUrl/query').respond(200)
		@composition({method: 'GET', url: '/query'})
		
	for method in ['GET','POST','PUT','DELETE']
		do (method) ->
			it "should support the shortcut method #{method}", inject ($http)->
				spyOn($http, method.toLowerCase()).andCallThrough()
				@$httpBackend.expect(method, '/baseUrl/query').respond(200)
				@composition[method.toLowerCase()]('/query')
				expect($http[method.toLowerCase()]).toHaveBeenCalled()
