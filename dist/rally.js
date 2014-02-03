angular.module('rally.app.iframe', ['rally.app.iframe.services']);

var IframeAppService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('rally.app.iframe.services.appService', ['rally.app.iframe.services.messagebus']).service('AppService', IframeAppService = (function() {
  IframeAppService.$inject = ['$messageBus'];

  function IframeAppService($messageBus) {
    this.$messageBus = $messageBus;
    this.register = __bind(this.register, this);
  }

  IframeAppService.prototype.register = function($rootScope) {
    return this.$messageBus.subscribe('objectupdate', (function(_this) {
      return function(type, data) {
        return $rootScope.broadcast(type, data);
      };
    })(this));
  };

  return IframeAppService;

})());

var IframeMessageBus,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('rally.app.iframe.services.messagebus', []).service('$messageBus', IframeMessageBus = (function() {
  IframeMessageBus.inject = ['$window'];

  function IframeMessageBus($window) {
    this.$window = $window;
    this.onParentMessage = __bind(this.onParentMessage, this);
    this.register = __bind(this.register, this);
    this.postToParent = __bind(this.postToParent, this);
    this.subscribe = __bind(this.subscribe, this);
    this.publish = __bind(this.publish, this);
    this.listeners = {};
  }

  IframeMessageBus.prototype.publish = function(eventName, data) {
    var event, listener, _i, _len, _ref, _results;
    event = {
      eventName: eventName,
      data: data
    };
    this.$window.parent.postMessage(event, "*");
    _ref = this.listeners[eventName];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      _results.push(listener.apply(this, [eventName, data]));
    }
    return _results;
  };

  IframeMessageBus.prototype.subscribe = function(eventName, listener) {
    var _base;
    this.register();
    this.postToParent('iframe:subscribe', {
      name: eventName
    });
    if ((_base = this.listeners)[eventName] == null) {
      _base[eventName] = [];
    }
    return this.listeners[eventName].push(listener);
  };

  IframeMessageBus.prototype.postToParent = function(eventName, data) {
    return window.parent.postMessage({
      name: eventName,
      data: data
    }, '*');
  };

  IframeMessageBus.prototype.register = function() {
    if (this.registered) {
      return;
    }
    this.registered = true;
    return this.$window.addEventListener("message", this.onParentMessage, false);
  };

  IframeMessageBus.prototype.onParentMessage = function(_arg) {
    var data, source;
    source = _arg.source, data = _arg.data;
    if (this.$window !== source) {
      return this.publish(data.name, data.data);
    }
  };

  return IframeMessageBus;

})());

angular.module('rally.app.iframe.services', ['rally.app.iframe.services.messagebus', 'rally.app.iframe.services.appService']);

angular.module('rally.app', ['rally.app.iframe']);



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
  RallyService.$inject = ['Ext', 'Rally'];

  function RallyService(Ext, Rally) {
    this.Ext = Ext;
    this.Rally = Rally;
    this.bind = __bind(this.bind, this);
    this.launchApp = __bind(this.launchApp, this);
  }

  RallyService.prototype.launchApp = function(appName, options, scope) {
    var defaults, self, theApp;
    if (options == null) {
      options = {};
    }
    if (scope == null) {
      scope = null;
    }
    self = this;
    defaults = {
      extend: 'Rally.app.app'
    };
    if (scope) {
      defaults.launch = function() {
        return self.bind(scope, this);
      };
    }
    options = _.extend(defaults, options);
    theApp = this.Ext.define(appName, options);
    return this.Rally.launchApp(appName);
  };

  RallyService.prototype.bind = function(scope, observable) {
    Ext.util.Observable.capture(observable, function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      scope.$emit.apply(scope, [name].concat(__slice.call(args)));
      if (!scope.$$phase) {
        return scope.$digest();
      }
    });
    return observable;
  };

  return RallyService;

})());
