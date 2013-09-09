'use strict';

angular.module 'rally.service', []
angular.module 'rally.component', ['rally.service']

app = angular.module 'rally', ['rally.component', 'rally.service']

app.config ($routeProvider) ->
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

app.run ($rally) ->
  debugger
  $rally.app 'SampleApp'