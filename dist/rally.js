

angular.module('Ext', []).factory('Ext', function() {
  return Ext;
});

angular.module('Rally', []).factory('Rally', function() {
  return Rally;
});

angular.module('rally', ['rally.services']);

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
