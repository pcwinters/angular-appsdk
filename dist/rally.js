angular.module('rally.api', ['rally.api.services']);

angular.module('rally.api.services', ['rally.api.services.slm', 'rally.api.services.wsapi', 'rally.api.services.lookback']);

/**
 * @ngdoc service
 * @name rally.api.services:$lookback
 * @description
 * @example
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('rally.api.services.lookback', []).provider('$lookback', function() {
  var LookbackApi,
    _this = this;
  this.baseUrl = '/analytics/v2.0/service/rally';
  this.setBaseUrl = function(baseUrl) {
    _this.baseUrl = baseUrl;
  };
  LookbackApi = (function() {
    function LookbackApi($http, baseUrl) {
      this.$http = $http;
      this.baseUrl = baseUrl;
      this.artifactSnapshots = __bind(this.artifactSnapshots, this);
    }

    LookbackApi.prototype.artifactSnapshots = function(workspaceOid, query, config) {
      return this.$http.post("" + this.baseUrl + "/workspace/" + workspaceOid + "/artifact/snapshot/query", JSON.stringify(query), config);
    };

    return LookbackApi;

  })();
  this.$get = function($http) {
    return new LookbackApi($http, _this.baseUrl);
  };
  return this;
});

/**
 * @ngdoc service
 * @name rally.api.services:$slm
 * @description
 * @example
*/

angular.module('rally.api.services.slm', ['rally.util.http']).provider('$slm', function() {
  var _this = this;
  this.baseUrl = '/slm/';
  this.setBaseUrl = function(baseUrl) {
    _this.baseUrl = baseUrl;
  };
  this.$get = function(rallyHttpWrapper) {
    return rallyHttpWrapper(_this.baseUrl);
  };
  return this;
});

/**
 * @ngdoc service
 * @name rally.api.services:$wsapi
 * @description
 * Abstracts $http calls to a wsapi base url. Can be configured at config/provider time to use a particular base url.
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rally.api.services.wsapi'])
						.config(function($wsapiProvider){
							$wsapiProvider.setBaseUrl('/test/');
						})
						.controller('Ctrl',
							function Ctrl($scope, $httpBackend, $wsapi) {
								$scope.$wsapi = $wsapi;
								console.log('backend', $httpBackend)
								console.log('backend.whenGET', $httpBackend.whenGET)
								$httpBackend.whenGET('/test/sub/url').respond(200, {foo: 'bar'});
								$wsapi({method: 'GET', url: '/sub/url/'}).then(function(data, status){
									$scope.data = data
									$scope.status = status
								});
							}
						);
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">
							<div>Wsapi base url: {{$wsapi.baseUrl}}</div>
							<div>data: {{data}}</div>
							<div>status: {{status}}</div>
						</div>
				</file>
		</example>
*/

angular.module('rally.api.services.wsapi', ['rally.api.services.slm', 'rally.util.http']).provider('$wsapi', function() {
  var _this = this;
  this.baseUrl = '/webservice/v2.0/';
  this.setBaseUrl = function(baseUrl) {
    _this.baseUrl = baseUrl;
  };
  this.$get = function(rallyHttpWrapper, $slm) {
    return rallyHttpWrapper(_this.baseUrl, $slm);
  };
  return this;
});

angular.module('rally.api.wsapi', ['rally.api.services.wsapi', 'rally.api.wsapi.projects']);

var RallyApiWsapiProjects,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('rally.api.wsapi.projects', ['rally.util.http.services.promise', 'rally.api.services.wsapi', 'rally.util.async']).run(function($wsapi, rallyApiWsapiProjects) {
  return $wsapi.projects = rallyApiWsapiProjects;
}).service('rallyApiWsapiProjects', RallyApiWsapiProjects = (function() {
  function RallyApiWsapiProjects($q, $wsapi, httpPromise) {
    this.$q = $q;
    this.$wsapi = $wsapi;
    this.httpPromise = httpPromise;
    this._scopeUp = __bind(this._scopeUp, this);
    this._scopeDown = __bind(this._scopeDown, this);
    this.scope = __bind(this.scope, this);
    this.children = __bind(this.children, this);
    this.concurrencyLimit = 4;
  }

  /*
  		@param {object} projectScope - an object with 'oid' and 'workspaceOid' properties
  			Workspaces should have identical oid and workspaceOid
  */


  RallyApiWsapiProjects.prototype.children = function(projectScope, onlyOpen) {
    var type, url;
    if (onlyOpen == null) {
      onlyOpen = true;
    }
    type = projectScope.oid === projectScope.workspaceOid ? 'workspace' : 'project';
    url = "/" + type + "/" + projectScope.oid + "/Children";
    if (onlyOpen) {
      url += '?query=(State != "Closed")';
    }
    return this.httpPromise.asArray(this.$wsapi({
      url: url,
      method: 'JSONP',
      params: {
        'jsonp': 'JSON_CALLBACK'
      }
    }).then(function(response) {
      return response.data.QueryResult.Results;
    }));
  };

  /*
  		@param {object} projectScope - an object with 'oid' and 'workspaceOid' properties
  			Workspaces should have identical oid and workspaceOid
  		@param {string} direction - 'up' or 'down' [default] to load a project tree
  */


  RallyApiWsapiProjects.prototype.scope = function(projectScope, direction) {
    if (direction == null) {
      direction = 'down';
    }
    switch (direction) {
      case 'down':
        return this._scopeDown(projectScope);
      case 'up':
        return this._scopeUp(projectScope);
    }
  };

  RallyApiWsapiProjects.prototype._scopeDown = function(projectScope, concurrency) {
    var deferred, queue,
      _this = this;
    if (concurrency == null) {
      concurrency = this.concurrencyLimit;
    }
    deferred = this.$q.defer();
    queue = async.queue(function(_arg, callback) {
      var projectScope;
      projectScope = _arg.projectScope;
      deferred.notify(projectScope);
      projectScope.children = _this.children(projectScope);
      projectScope.name = projectScope.Name;
      return projectScope.children.$promise.then(function(children) {
        _.each(children, function(child) {
          child.oid = child.ObjectID;
          child.workspaceOid = projectScope.workspaceOid;
          return queue.push({
            projectScope: child
          });
        });
        return callback();
      });
    }, concurrency);
    queue.drain = function() {
      return deferred.resolve();
    };
    queue.push({
      projectScope: projectScope
    });
    return deferred.promise;
  };

  RallyApiWsapiProjects.prototype._scopeUp = function(projectScope) {};

  return RallyApiWsapiProjects;

})());

var __slice = [].slice;

angular.module('rally.app.iframe.decorators.rootScope', []).config(function($provide) {
  return $provide.decorator('$rootScope', function($delegate) {
    var $emit;
    $emit = $delegate.__proto__.$emit;
    $delegate.__proto__.$emit = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      $emit.apply(this, arguments);
      return $emit.apply(this, ['*', name].concat(args));
    };
    return $delegate;
  });
});

angular.module('rally.app.iframe', ['rally.app.iframe.services']);

var IframeAppService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('rally.app.iframe.services.appService', ['rally.app.iframe.services.messagebus']).service('AppService', IframeAppService = (function() {
  IframeAppService.$inject = ['$rootScope', '$messageBus'];

  function IframeAppService($rootScope, $messageBus) {
    this.$rootScope = $rootScope;
    this.$messageBus = $messageBus;
    this.register = __bind(this.register, this);
  }

  IframeAppService.prototype.register = function(appName) {
    return this.$rootScope.$broadcast('iframe:appRegister', appName);
  };

  return IframeAppService;

})());

var IframeMessageBus,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

angular.module('rally.app.iframe.services.messageBus', ['rally.app.iframe.decorators.rootScope']).service('$messageBus', IframeMessageBus = (function() {
  IframeMessageBus.inject = ['$window', '$rootScope'];

  function IframeMessageBus($window, $rootScope) {
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.onParentMessage = __bind(this.onParentMessage, this);
    this.onScopeMessage = __bind(this.onScopeMessage, this);
    this.$window.addEventListener("message", this.onParentMessage, false);
    this.$rootScope.$on('*', this.onScopeMessage);
  }

  IframeMessageBus.prototype.onScopeMessage = function() {
    var args, event, eventName, wildcard, _ref;
    wildcard = arguments[0], eventName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (eventName.indexOf("rally.app:") === 0) {
      eventName = eventName.replace("rally.app:", "");
      event = {
        name: eventName,
        args: args
      };
      return (_ref = this.$window.parent) != null ? _ref.postMessage(event, "*") : void 0;
    }
  };

  IframeMessageBus.prototype.onParentMessage = function(event) {
    var args, data, name, source;
    source = event.source, data = event.data;
    name = "rally.app:" + data.name;
    args = [name].concat(data.args);
    return this.$rootScope.$broadcast.apply(this.$rootScope, args);
  };

  return IframeMessageBus;

})());

angular.module('rally.app.iframe.services', ['rally.app.iframe.services.messageBus', 'rally.app.iframe.services.appService']);

angular.module('rally.app', ['rally.app.services']);

angular.module('rally.app.services', ['rally.app.services.rally']);

var RallyAppService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

angular.module('rally.app.services.rally', ['Ext', 'Rally']).service('$rally', RallyAppService = (function() {
  function RallyAppService($q, $rootScope, $log, Ext, Rally) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.Ext = Ext;
    this.Rally = Rally;
    this.bind = __bind(this.bind, this);
    this.launchApp = __bind(this.launchApp, this);
  }

  RallyAppService.prototype.launchApp = function(appName, options, scope) {
    var defaults, deferred, self, theApp;
    if (options == null) {
      options = {};
    }
    if (scope == null) {
      scope = this.$rootScope;
    }
    deferred = this.$q.defer();
    self = this;
    defaults = {
      extend: 'Rally.app.App',
      launch: function() {}
    };
    options = _.extend(defaults, options);
    options.launch = _.wrap(options.launch, function() {
      var args, fn;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      fn.apply(this, args);
      self.bind(scope, this);
      return deferred.resolve(this);
    });
    theApp = this.Ext.define(appName, options);
    this.Rally.launchApp(appName);
    return deferred.promise;
  };

  RallyAppService.prototype.bind = function(scope, observable) {
    var _this = this;
    this.$log.debug('Binding to Rally app events');
    Ext.util.Observable.capture(observable, function() {
      var args, name, _ref;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      (_ref = _this.$log).debug.apply(_ref, ["rally event: " + name + " "].concat(__slice.call(args)));
      scope.$emit.apply(scope, [name].concat(__slice.call(args)));
      if (!scope.$$phase) {
        return scope.$digest();
      }
    });
    return observable;
  };

  return RallyAppService;

})());



angular.module('Ext', []).factory('Ext', function() {
  return Ext;
});

angular.module('Rally', []).factory('Rally', function() {
  return Rally;
});

angular.module('rally', ['rally.api', 'rally.app', 'rally.util']);

angular.module('rally.util.async', []).factory('async', function() {
  return async;
});

/**
 * @ngdoc service
 * @name rally.util.cache:$cacheWrap
 * @type function
 * @description
 * Helper function that returns a cached value or runs your function to cache the result and return your value as a promise.
 * If you value function returns a promise, the wrapper will wait for resolution and put the result in your cache.
*/

angular.module('rally.util.cache.factories.wrap', ['rally.util.lodash']).factory('$cacheWrap', function($q) {
  var $cacheWrap;
  $cacheWrap = function(cache, keyFn) {
    if (keyFn == null) {
      keyFn = _.identity;
    }
    return function(key, func) {
      var deferred;
      key = keyFn(key);
      if (cache.get(key)) {
        return $q.when(cache.get(key));
      }
      deferred = $q.defer();
      cache.put(key, deferred.promise);
      deferred.promise.then(function(result) {
        return cache.put(key, result);
      }, function() {
        return cache.remove(key);
      });
      deferred.resolve($q.when(func()));
      return deferred.promise;
    };
  };
  return $cacheWrap;
});

angular.module('rally.util.cache', ['rally.util.cache.factories.wrap']);

var __slice = [].slice;

angular.module('rally.util.http.factories.httpWrapper', ['rally.util.lodash']).factory('rallyHttpWrapper', function($http) {
  return function(baseUrl, http) {
    var getUrl, wrapper;
    if (http == null) {
      http = $http;
    }
    getUrl = function(url) {
      var toAdd;
      toAdd = url;
      if (baseUrl[baseUrl.length - 1] === '/' && url.indexOf('/') === 0) {
        toAdd = toAdd.substring(1);
      }
      return baseUrl + toAdd;
    };
    wrapper = function(urlOrConfig, config) {
      if (_.isString(urlOrConfig)) {
        urlOrConfig = getUrl(urlOrConfig);
      } else {
        urlOrConfig.url = getUrl(urlOrConfig.url);
      }
      return http.call(this, urlOrConfig, config);
    };
    _.each(['GET', 'DELETE', 'POST', 'PUT'], function(method) {
      return wrapper[method.toLowerCase()] = function() {
        var args, url, _ref;
        url = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        url = getUrl(url);
        return (_ref = http[method.toLowerCase()]).call.apply(_ref, [this, url].concat(__slice.call(args)));
      };
    });
    return wrapper;
  };
});

angular.module('rally.util.http', ['rally.util.http.factories.httpWrapper', 'rally.util.http.services.promise']);

var HttpPromise;

angular.module('rally.util.http.services.promise', ['rally.util.lodash']).service('httpPromise', HttpPromise = (function() {
  function HttpPromise() {}

  HttpPromise.prototype.asArray = function(promise) {
    var data;
    data = [];
    data.$promise = promise;
    promise.then(function(results) {
      return _.each(results, function(r) {
        return data.push(r);
      });
    });
    return data;
  };

  HttpPromise.prototype.asObject = function(promise) {
    var data;
    data = {};
    data.$promise = promise;
    promise.then(function(result) {
      return _.merge(data, result);
    });
    return data;
  };

  return HttpPromise;

})());

angular.module('rally.util.lodash', ['rally.util.lodash.sortedInsert']);

angular.module('rally.util.lodash.sortedInsert', []).run(function() {
  _.sortedInsert = function(array, value, pluck) {
    var index;
    index = _.sortedIndex(array, value, pluck);
    array.splice(index, 0, value);
    return array;
  };
  return _.sortedReverseInsert = function(array, value, pluck) {
    _.sortedInsert(array.reverse(), value, pluck);
    return array.reverse();
  };
});

var __slice = [].slice;

angular.module('rally.util.timeout', []).factory('$rallyTimeoutThrottleFactory', function($timeout) {
  return function(max) {
    var processNext, queue, running;
    queue = [];
    running = 0;
    processNext = function() {
      var args, context, next;
      if (running >= max) {
        return;
      }
      next = queue.shift();
      context = next[0];
      args = next.slice(1);
      running = running + 1;
      return $timeout.apply(context, args)['finally'](function() {
        running = running - 1;
        return processNext();
      });
    };
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      queue.push([this].concat(args));
      return processNext();
    };
  };
}).factory('$rallyTimeoutThrottle', function($rallyTimeoutThrottleFactory) {
  return $rallyTimeoutThrottleFactory(10);
});

var util;

util = angular.module('rally.util', ['rally.util.async', 'rally.util.cache', 'rally.util.http', 'rally.util.lodash', 'rally.util.timeout']);
