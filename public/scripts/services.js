'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', function($http){
        var baseUrl = "http://localhost:3000";

        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/authenticate', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                localStorage.clear();
                success();
            },
            getUsername: function(success, error) {
                $http.get(baseUrl + '/getUsername').success(success).error(error)
            },
            createList: function(data, success, error) {
                $http.post(baseUrl + '/createList', data).success(success).error(error)
            },
            createTask: function(data, success, error) {
                $http.post(baseUrl + '/createTask', data).success(success).error(error)
            },
            getListTasks: function(data, success, error){
                $http.post(baseUrl + '/getListTasks', data).success(success).error(error)
            },
            deleteList: function(data, success, error){
                $http.post(baseUrl + '/deleteList', data).success(success).error(error)
            },
            deleteTask: function(data, success, error){
                $http.post(baseUrl + '/deleteTask', data).success(success).error(error)
            },
            changeTaskDone: function(data, success, error){
                $http.post(baseUrl + '/changeTaskDone', data).success(success).error(error)
            },
            saveTaskChanges: function(data, success, error){
                $http.post(baseUrl + '/saveTaskChanges', data).success(success).error(error)
            },
            updateTaskDescription: function(data, success, error){
                $http.post(baseUrl + '/updateTaskDescription', data).success(success).error(error)
            },
            updateTaskExpirationDate: function(data, success, error){
                $http.post(baseUrl + '/updateTaskExpirationDate', data).success(success).error(error)
            },
            createSubTask: function(data, success, error){
                $http.post(baseUrl + '/createSubTask', data).success(success).error(error)
            },
            updateSubTask: function(data, success, error){
                $http.post(baseUrl + '/updateSubTask', data).success(success).error(error)
            },
        };
    }
]);