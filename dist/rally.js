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

angular.module('rally.app', []);



angular.module('Ext', []).factory('Ext', function() {
  return Ext;
});

angular.module('Rally', []).factory('Rally', function() {
  return Rally;
});

angular.module('rally', ['rally.services', 'rally.app']);

angular.module('rally.services', ['rally.services.rally']);

var RallyService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

angular.module('rally.services.rally', ['Ext', 'Rally']).service('$rally', RallyService = (function() {
  function RallyService($q, $rootScope, $log, Ext, Rally) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.Ext = Ext;
    this.Rally = Rally;
    this.bind = __bind(this.bind, this);
    this.launchApp = __bind(this.launchApp, this);
  }

  RallyService.prototype.launchApp = function(appName, options, scope) {
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

  RallyService.prototype.bind = function(scope, observable) {
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

  return RallyService;

})());
