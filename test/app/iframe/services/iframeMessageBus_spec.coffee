describe 'rally.app.iframe.services.messageBus', ->
	async = new AsyncSpec(@)

	async.beforeEach((done)->
		module('rally.app.iframe.services.messageBus')
		done()
	)
	
	async.beforeEach((done)->
		inject((@$window, @$rootScope)->
			spyOn(@$window, 'addEventListener').andCallThrough()
			spyOn(@$window, 'postMessage').andCallThrough()
			@$window.parent = 
				postMessage: jasmine.createSpy('parent.postMessage')

			@$rootScope._patrick = 'patrick'			
		)
		done()
	)
	async.beforeEach((done)->
		inject(($messageBus) -> )
		done()
	)

	async.it 'should broadcast messages from the parent on to the scope when they have the "rally:" prefix', (done) ->
		spy = ({name}, args...) =>
			expect(name).toEqual('rally:eventName')
			expect(args).toEqual([1,2])			
			done()
		@$rootScope.$on('rally:eventName', spy)
		@$window.postMessage({name:'eventName', args:[1,2]}, "*")

	async.it 'should post scope messages to the parent when they have the "rally:" prefix', (done) ->
		@$rootScope.$emit('rally:eventName', 1, 2)
		expect(@$window.parent.postMessage).toHaveBeenCalled()
		expect(@$window.parent.postMessage).toHaveBeenCalledWith({name:'eventName', args:[1,2]}, "*")
		done()
		