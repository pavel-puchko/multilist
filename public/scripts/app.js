'use strict';

angular.module('angularRestfulAuth', [
    'ngRoute',
    'angular-loading-bar'
])
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'MeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if (localStorage.getItem("token")) {
                        config.headers.Authorization = 'Bearer ' + localStorage.getItem("token");
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
]);