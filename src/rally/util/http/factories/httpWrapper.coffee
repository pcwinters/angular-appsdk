angular.module('rally.util.http.factories.httpWrapper', [
	'rally.util.lodash'
]).factory 'rallyHttpWrapper', ($http)->
	return (baseUrl, http=$http)->
		getUrl = (url)->
			toAdd = url
			if baseUrl[baseUrl.length - 1] is '/' and url.indexOf('/') is 0
				toAdd = toAdd.substring(1)			
			return baseUrl+toAdd

		wrapper = (urlOrConfig, config)->
			if _.isString(urlOrConfig)
				urlOrConfig = getUrl(urlOrConfig)
			else
				urlOrConfig.url = getUrl(urlOrConfig.url)
			http.call(this, urlOrConfig, config)

		# Write shortcut methods for GET/POST/PUT/DELETE/etc
		_.each ['GET', 'DELETE', 'POST', 'PUT'], (method)->
			wrapper[method.toLowerCase()] = (url, args...)->
				url = getUrl(url)
				http[method.toLowerCase()].call(@, url, args...)

		return wrapper
