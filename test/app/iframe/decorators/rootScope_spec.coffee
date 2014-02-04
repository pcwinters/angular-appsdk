describe 'rally.app.iframe.decorators.rootScope', ->

	beforeEach(module('rally.app.iframe.decorators.rootScope'))
	beforeEach(inject((@$rootScope) -> ))

	it 'should support wildcard listeners', ->
		spy = jasmine.createSpy()
		@$rootScope.$on('*', spy)
		@$rootScope.$emit('eventName', 1, 2)
		expect(spy).toHaveBeenCalled()

	it 'should splice the real event name as the first argument', ->
		spy = jasmine.createSpy()
		@$rootScope.$on('*', spy)
		@$rootScope.$emit('eventName', 1, 2)
		expect(spy.mostRecentCall.args[1..]).toEqual(['eventName', 1, 2]);
	
	it 'should support wildcards on children scope', ->
		spy = jasmine.createSpy()
		$scope = @$rootScope.$new()
		$scope.$on('*', spy)
		$scope.$emit('eventName', 1, 2)
		expect(spy).toHaveBeenCalled()
