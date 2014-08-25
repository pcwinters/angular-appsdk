describe 'rally.util.timeout', ->
	
	beforeEach angular.mock.module('rally.util.timeout')
	
	describe '$rallyTimeoutThrottleFactory', ->
		beforeEach ->
			@$timeout = jasmine.createSpy('$timeout')
			angular.module('test.rally.util.timeout', []).value('$timeout', @$timeout)
			angular.mock.module('test.rally.util.timeout')

		beforeEach inject (@$rallyTimeoutThrottleFactory, @$q)->
			@$throttle = @$rallyTimeoutThrottleFactory(2)
			
		it 'should delegate to $timeout to run my function', ->
			@$timeout.andReturn(@$q.when())
			spy = jasmine.createSpy('func')
			@$throttle(spy, 'foo', 'bar')
			expect(@$timeout).toHaveBeenCalledWith(spy, 'foo', 'bar')

		it 'should queue my timeouts', ->
			spies = _.map([0,1,2], (i)-> jasmine.createSpy("throttled:#{i}"))
			timeoutCalls = []
			@$timeout.andCallFake (args...)=>
				deferred = @$q.defer()
				timeoutCalls.push(deferred)
				return deferred.promise
			
			_.each(spies, (spy)=>@$throttle(spy))
			expect(timeoutCalls.length).toEqual(2)
			expect(@$timeout).toHaveBeenCalledWith(spies[0])
			expect(@$timeout).toHaveBeenCalledWith(spies[1])
			expect(@$timeout).not.toHaveBeenCalledWith(spies[2])

		it 'should run timeouts when queue frees up', inject ($rootScope)->
			spies = _.map([0,1,2], (i)-> jasmine.createSpy("throttled:#{i}"))
			timeoutCalls = []
			@$timeout.andCallFake (args...)=>
				deferred = @$q.defer()
				timeoutCalls.push(deferred)
				return deferred.promise
			
			_.each(spies, (spy)=>@$throttle(spy))
			expect(timeoutCalls.length).toEqual(2)
			expect(@$timeout).toHaveBeenCalledWith(spies[0])
			expect(@$timeout).toHaveBeenCalledWith(spies[1])
			expect(@$timeout).not.toHaveBeenCalledWith(spies[2])
			
			# Resolve a queued timeout and 
			timeoutCalls[1].resolve()
			$rootScope.$digest()

			expect(@$timeout).toHaveBeenCalledWith(spies[2])
			expect(timeoutCalls.length).toEqual(3)

	describe 'default $rallyTimeoutThrottle', ->

		beforeEach ->
			@factorySpy = jasmine.createSpy()
			angular.module('test.rally.util.timeout', []).value('$rallyTimeoutThrottleFactory', @factorySpy)
			angular.mock.module('test.rally.util.timeout')

		it 'should create a timeout throttle with a default throttle value of 10', inject ($rallyTimeoutThrottle)->
			expect(@factorySpy).toHaveBeenCalledWith(10)
