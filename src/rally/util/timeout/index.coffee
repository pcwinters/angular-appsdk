# Throttles and queues timeouts so you don't overload the worker thread and block the browser.
angular.module('rally.util.timeout', [])
.factory '$rallyTimeoutThrottleFactory', ($timeout)->
	return (max)->
		queue = []
		running = 0
		
		processNext = ()->
			if running >= max then return
			next = queue.shift()
			context = next[0]
			args = next[1...]
			running = running + 1	
			$timeout.apply(context, args)['finally'](()->
				running = running - 1
				processNext()

			)
		return (args...)->
			queue.push([this].concat(args))
			processNext()

# Default throttle processes 10 timeouts at a time.
.factory '$rallyTimeoutThrottle', ($rallyTimeoutThrottleFactory)->
	return $rallyTimeoutThrottleFactory(10)
