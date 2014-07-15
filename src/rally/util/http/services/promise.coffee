angular.module('rally.util.http.services.promise', [
	'rally.util.lodash'
])
.service 'httpPromise',

	class HttpPromise
		asArray: (promise)->
			data = []
			data.$promise = promise
			promise.then (results)->
				_.each results, (r)-> data.push(r)
			return data

		asObject: (promise)->
			data = {}
			data.$promise = promise
			promise.then (result)->
				_.merge data, result
			return data
