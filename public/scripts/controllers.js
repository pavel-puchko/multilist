'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        $scope.signin = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)    
                } else {
                    localStorage.token = res.data.token;
                    window.location = "/";    
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.save(formData, function(res) {
                console.log(res.data);
                if (res.type == false) {
                    alert(res.data)
                } else {
                    localStorage.token = res.data.token;
                    window.location = "/"; 
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.logout = function() {
            Main.logout(function() {
                window.location = "/"; 
            }, function() {
                alert("Failed to logout!");
            });
        };
        $scope.token = localStorage.getItem("token");
        if ($scope.token){
            Main.getUsername(function(res) {
            $scope.myUsername = res.data;
        }, function() {
            alert("Failed to fetch details");
        });
        }
    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
        $scope.newList = {};
        $scope.newList.listHeader = "";
        $scope.newList.listUser = "";
        $scope.newList.users = [];

        $scope.newSubTaskHeader = "";
        $scope.newTaskHeader = "";
        $scope.currentList = {};
        $scope.currentTask;

        Main.me(function(res) {
            $scope.myDetails = res;

        }, function() {
            alert("Failed to fetch details");
        });
        $(window).on('popstate', function() {
             $('#myModal').modal('hide');
             $('.modal-backdrop').remove();
        });

        $scope.addListUser = function(user) {
            if ($scope.newList.users.indexOf(user) === -1){
                $scope.newList.users.push(user);
                $scope.newList.listUser = "";
            } 
            $scope.newList.listUser = "";
        };
        $scope.deleteUser = function(user) {
            $scope.newList.users.splice($scope.newList.users.indexOf(user), 1);
        }
        $scope.createList = function() {
            var newList = {};
            //list data
            newList.listHeader = $scope.newList.listHeader;
            newList.users = [$scope.myDetails.data.email];
            if ($scope.newList.users.length > 0){
                newList.users.push($scope.newList.users);
            }
            ///
            var sendData = {};
            //send data
            sendData.newList = newList;
            //
            $('#myModal').modal('hide')
            Main.createList(sendData,function(res) {
                $scope.newListHeader = "";
                $scope.myDetails.lists.push(res.data);
                console.log("List created")
                console.log(res);
                }, function () {
                    alert("Failed to create list");
                }
            )
        };

        $scope.createTask = function() {
            if ($scope.newTaskHeader.length === 0){
                alert("Task name is empty");
            }else {
                var newTask = {};
                //list data
                newTask.itemHeader = $scope.newTaskHeader;
                newTask.done = false;
                newTask.listId = $scope.currentList.id;
                ///
                var sendData = {};
                //send data
                sendData.newTask = newTask;
                //
                Main.createTask(sendData,function(res) {
                    $scope.newTaskHeader = "";
                    $scope.currentList.items.push(res.data);
                    console.log("Task created");
                    $scope.showMoreInfo(res.data._id);
                    }, function () {
                        alert("Failed to create task");
                    }
                )

            }
        };

        $scope.changeCurrentList = function(listId) {
            $("#lists-block li.active").removeClass("active");
            $('#'+listId).addClass("active");
            $scope.currentList.id = listId;
            var sendData = {};
            sendData.listId = listId;


            Main.getListTasks(sendData, function(res) {
                $scope.currentList.items = res.data;
                $('#tasks-block').removeClass('hide');
                $('#task-info-block').addClass('hide');
            });

        };

        $scope.deleteList = function(listId) {
            if (confirm("Delete list?")){
                var sendData = {};
                sendData.listId = listId;
                Main.deleteList(sendData, function(){
                    var listIndex;
                    $scope.myDetails.lists.forEach(function(cur, index){
                        if (cur._id === listId){
                            listIndex = index;
                        }
                    });
                    $scope.myDetails.lists.splice(listIndex, 1);
                })
            }
        };
        $scope.deleteTask = function(taskId) {
            if (confirm("Delete task?")){
                var sendData = {};
                sendData.taskId = taskId;
                sendData.listId = $scope.currentList.id;
                Main.deleteTask(sendData, function(){
                    var taskIndex;
                    $scope.currentList.items.forEach(function(cur, index){
                        if (cur._id === taskId){
                            taskIndex = index;
                        }
                    });
                    $scope.currentList.items.splice(taskIndex, 1);
                })
            }
        };
        $scope.changeTaskDone = function(taskId) {
            var sendData = {};
            var taskIndex;
            sendData.taskId = taskId;
            sendData.listId = $scope.currentList.id;
            $scope.currentList.items.forEach(function(cur, index){
                if (cur._id === taskId){
                      taskIndex = index;
                }
            });
            sendData.newValue = !$scope.currentList.items[taskIndex].done;
            Main.changeTaskDone(sendData, function(res){
                $scope.currentList.items[taskIndex].done = !$scope.currentList.items[taskIndex].done;
                console.log(res);
            })
        };
        $scope.showMoreInfo = function(taskId){
            var taskIndex;
            $('#taskExpDate').blur($scope.updateTaskExpirationDate);
            $('#task-info-block').removeClass("hide");
            $("#tasks-block li.active").removeClass("active");
            $('#'+ taskId).addClass("active");
            $scope.currentList.items.forEach(function(cur, index){
                if (cur._id === taskId){
                      taskIndex = index;
                }
            });
            $scope.currentTask = $scope.currentList.items[taskIndex];
            console.log($scope.currentTask);
        };
        $scope.saveTaskChanges = function() {
            var newExpirationDate, newDescription;
            var sendData = {};
            sendData.expirationDate = newExpirationDate;
            sendData.description = newDescription;
            sendData.taskId = $scope.currentTask._id;
            sendData.listId = $scope.currentTask.listId;
            Main.saveTaskChanges(sendData, function(res){
                $scope.currentTask.expirationDate = newExpirationDate;
                $scope.currentTask.description = newDescription;
            });
        };

        $scope.createSubTask = function() {
            var unique = true;
            $scope.currentTask.subitems.forEach(function (current) {
                if (current.subItemHeader === $scope.newSubTaskHeader) {
                    unique = false
                }
            });
            if (unique){

                var sendData = {};
                var newSubTask = {};
                            
                newSubTask.subItemHeader = $scope.newSubTaskHeader;
                newSubTask.done = false;
                sendData.taskId = $scope.currentTask._id;
                sendData.listId = $scope.currentTask.listId;
                sendData.newSubTask = newSubTask;
                Main.createSubTask(sendData, function(res){
                    $scope.currentTask.subitems.push(newSubTask);
                    $scope.newSubTaskHeader = "";
                })
            } else {
                alert("Bad subtask name");
            }
        };
        $scope.changeSubTaskDone = function(subTaskId) {
            var sendData = {};
            var subTaskIndex;
            $scope.currentTask.subitems.forEach(function(cur, index){
                if (cur._id === subTaskId){
                    subTaskIndex = index;
                }
            });
            sendData.type = "done";
            sendData.taskId = $scope.currentTask._id;
            sendData.listId = $scope.currentTask.listId;
            sendData.done = !$scope.currentTask.subitems[subTaskIndex].done;
            sendData.subTaskId = subTaskId;
            Main.updateSubTask(sendData, function(){
                $scope.currentTask.subitems[subTaskIndex].done = !$scope.currentTask.subitems[subTaskIndex].done;
            })

        };
        $scope.deleteSubTask = function(subTaskId) {
            var sendData = {};
            sendData.type = "delete";
            sendData.taskId = $scope.currentTask._id;
            sendData.listId = $scope.currentTask.listId;
            sendData.subTaskId = subTaskId;
            Main.updateSubTask(sendData, function(){
                var subTaskIndex;
                $scope.currentTask.subitems.forEach(function(cur, index){
                    if (cur._id === subTaskId){
                        subTaskIndex = index;
                    }
                });
                $scope.currentTask.subitems.splice(subTaskIndex, 1);
            })

        };
        $scope.updateTaskExpirationDate = function() {
            var sendData = {};
            sendData.taskId = $scope.currentTask._id;
            sendData.listId = $scope.currentTask.listId;
            sendData.newExpirationDate = $('#taskExpDate').val();
            Main.updateTaskExpirationDate(sendData, function(){
                            console.log("success upadate expirationDate");
                        })
        }
        $scope.$watch('currentTask', function(newVal, oldVal){
            if (typeof newVal !== "undefined" && typeof oldVal !== "undefined" ) {
                if (oldVal._id === newVal._id) {
                    var sendData = {};
                    sendData.taskId = $scope.currentTask._id;
                    sendData.listId = $scope.currentTask.listId;
                    if(oldVal.description !== newVal.description){
                        sendData.newDescription = newVal.description;
                        Main.updateTaskDescription(sendData, function(){
                            console.log("success upadate description");
                        })
                    }
                }
            }
        }, true);
}]);
