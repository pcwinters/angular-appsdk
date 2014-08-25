###*
 * @ngdoc service
 * @name rally.util.cache:$cacheWrap
 * @type function
 * @description
 * Helper function that returns a cached value or runs your function to cache the result and return your value as a promise.
 * If you value function returns a promise, the wrapper will wait for resolution and put the result in your cache.
###
angular.module('rally.util.cache.factories.wrap', ['rally.util.lodash']).factory '$cacheWrap', ($q)->
	$cacheWrap = (cache, keyFn=_.identity) ->
		return (key, func)->
			key = keyFn(key)
			if cache.get(key) then return $q.when(cache.get(key))
			
			# Run the function
			deferred = $q.defer()
			cache.put(key, deferred.promise)
			
			deferred.promise.then(
				(result)->
					cache.put(key, result)
				,
				()->
					cache.remove(key)
			)

			deferred.resolve($q.when(func()))
			return deferred.promise

	return $cacheWrap
