var express = require('express');
var jwt     = require("jsonwebtoken");
var router  = express.Router();
var mongoose = require('mongoose');


var User     = require('../models/User');
var List     = require('../models/List');
var Item     = require('../models/Item');


function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

router.post('/authenticate', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    });
});


router.post('/signin', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, "Bearer");
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

router.get('/me', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            List.find({users: user.email}).lean().exec( function(err, userLists){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: user,
                            lists: userLists
                        });
                }
            });
        }
    });
});

router.get('/getUsername', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
                res.json({
                    type: true,
                    data: user.email
                });
        }
        
    });
});
router.post('/getListTasks', ensureAuthorized, function(req, res) {
    Item.find({listId: req.body.listId}, function(err, items){
        if (err) {
            res.json({
                type: false,
                data: "Error occured" + err
            });
        } else {
                res.json({
                    type: true,
                    data: items
                });
        }
    });

});

router.post('/createList',ensureAuthorized, function(req, res) {

    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                var listModel = new List();
                listModel.listHeader = req.body.newList.listHeader;
                listModel.users = req.body.newList.users;
                listModel.owner = user.email;
                listModel.save(function(err, newList) {
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    } else {
                            res.json({
                                type: true,
                                data: newList
                            });
                    }
                }); 
            }
        }
    });
});

router.post('/createTask',ensureAuthorized, function(req, res) {

    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                var itemModel = new Item();
                itemModel.itemHeader = req.body.newTask.itemHeader;
                itemModel.listId = req.body.newTask.listId;
                itemModel.done = req.body.newTask.done;
                itemModel.save(function(err, newItem) {
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    } else {
                            res.json({
                                type: true,
                                data: newItem
                            });
                    }
                }); 
            }
        }
    });
});

router.post('/deleteList', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            List.update({_id: req.body.listId}, { $pull: { "users": user.email}},  function(err, count){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: count
                        });
                }
            });
        }
    });
});
router.post('/deleteTask', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Item.remove({listId: req.body.listId, _id: req.body.taskId},  function(err, count){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: count
                        });
                }
            });
        }
    });
});

router.post('/changeTaskDone', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Item.update({listId: req.body.listId, _id: req.body.taskId},{ $set: { done: req.body.newValue }},  function(err, item){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: item
                        });
                }
            });
        }
    });
});
router.post('/updateTaskDescription', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Item.update({listId: req.body.listId, _id: req.body.taskId},{ $set: {  description: req.body.newDescription }},  function(err, item){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: item
                        });
                }
            });
        }
    });
});
router.post('/updateTaskExpirationDate', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Item.update({listId: req.body.listId, _id: req.body.taskId},{ $set: { expirationDate: req.body.newExpirationDate }},  function(err, item){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: item
                        });
                }
            });
        }
    });
});
router.post('/createSubTask',ensureAuthorized, function(req, res) {

    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Item.update({_id: req.body.taskId, listId: req.body.listId}, { $push: { "subitems": req.body.newSubTask}},  function(err, count){
                if (err) {
                    res.json({
                        type: false,
                        data: "Error occured: " + err
                    });
                } else {
                        res.json({
                            type: true,
                            data: count
                        });
                }
            });

        }
    });
});

router.post('/updateSubTask', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (req.body.type === "delete"){
                Item.update({_id: req.body.taskId, listId: req.body.listId}, { $pull: { "subitems": {_id: req.body.subTaskId}}},  function(err, count){
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    } else {
                            res.json({
                                type: true,
                                data: count
                            });
                    }
                });
            }
            if (req.body.type === "done"){
                Item.update({"subitems._id": req.body.subTaskId}, { $set: { "subitems.$.done": req.body.done}},  function(err, count){
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    } else {
                            res.json({
                                type: true,
                                data: count
                            });
                    }
                });
            }
        }
    });
});

module.exports = router;
