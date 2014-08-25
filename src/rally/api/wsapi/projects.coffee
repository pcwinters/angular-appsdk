angular.module('rally.api.wsapi.projects', [
	'rally.util.http.services.promise'
	'rally.api.services.wsapi'
	'rally.util.async'
])

.run ($wsapi, rallyApiWsapiProjects)->
	$wsapi.projects = rallyApiWsapiProjects

.service 'rallyApiWsapiProjects',
	class RallyApiWsapiProjects
		constructor: (@$q, @$wsapi, @httpPromise)->
			@concurrencyLimit = 4

		###
		@param {object} projectScope - an object with 'oid' and 'workspaceOid' properties
			Workspaces should have identical oid and workspaceOid
		###
		children: (projectScope, onlyOpen=true)=>
			type = if projectScope.oid is projectScope.workspaceOid then 'workspace' else 'project'
			url = "/#{type}/#{projectScope.oid}/Children"
			if onlyOpen then url += '?query=(State != "Closed")'
			
			return @httpPromise.asArray @$wsapi({
				url: url
				method: 'JSONP',
				params: {
					'jsonp': 'JSON_CALLBACK'
				}
			}).then (response)->
				return response.data.QueryResult.Results

		###
		@param {object} projectScope - an object with 'oid' and 'workspaceOid' properties
			Workspaces should have identical oid and workspaceOid
		@param {string} direction - 'up' or 'down' [default] to load a project tree
		###
		scope: (projectScope, direction='down')=>
			switch direction
				when 'down' then return @_scopeDown(projectScope)
				when 'up' then return @_scopeUp(projectScope)

		_scopeDown: (projectScope, concurrency=@concurrencyLimit)=>
			deferred = @$q.defer()
			queue = async.queue(({projectScope}, callback)=>
				deferred.notify(projectScope)
				projectScope.children = @children(projectScope)
				projectScope.name = projectScope.Name
				# Only finish when children have finished loading
				projectScope.children.$promise.then (children)-> 
					_.each children, (child)->
						child.oid = child.ObjectID
						child.workspaceOid = projectScope.workspaceOid
						queue.push({projectScope: child})
					callback()
			, concurrency)
			queue.drain = ()->
				deferred.resolve()
			queue.push({projectScope})
			return deferred.promise

		_scopeUp: (projectScope)=>
