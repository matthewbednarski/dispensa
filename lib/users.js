var Q = require('q');
var _ = require('lodash');
var uuid = require('node-uuid');
var moment = require('moment');
var save = require('save');
var filedb = require('./filedb.js');


function Users(file, debug) {
    console.log(file);
    if (file === undefined) {
        this.file = ".users_db.json";
    } else {
        this.file = file;
    }

    var itemSave = save('username', {
        debug: debug
    });
    var saveData = function() {
        var defer = Q.defer();
        itemSave.find({}, function(e, items) {
            if (e) {
                defer.reject(new Error(e));
            }
            if (items) {
                var outs = _.chain(items)
                    .value();
                filedb.writeData(outs, file).done(defer.resolve);
            } else {
                defer.reject(new Error("Nothing to"));
            }
        })
    };

    this.init = function() {
        var ctl = this;
        var defer = Q.defer();
        filedb
            .readIn(ctl.file)
            .then(function(data) {
                ctl.parseData(data)
                    .then(function(data) {
                        defer.resolve(data);
                    })
                    .catch(function(e) {
                        defer.reject(e);
                    });
            })
            .catch(function(e) {
                defer.resolve([]);
            });
        return defer.promise;
    };

    this.parseData = function(data) {
        var defer = Q.defer();
        var oData = JSON.parse(data);
        if (oData === undefined) {
            defer.reject(new Error(data));
        }
        var objs = _.chain(oData)
            .value();
        var promises = [];
        _.forEach(objs, function(obj) {
            var d = Q.defer();
            itemSave.create(
                obj, function(eU, itemU) {
                    if (eU) {
                        d.reject(new Error(eU));
                    }
                    if (itemU) {
                        d.resolve(itemU);
                    } else {
                        d.reject(new Error("Nothing to do..."));
                    }
                    promises.push(d.promise);
                });
        });
        Q.allSettled(promises).done(
            function(d) {
                // console.log(d);
                defer.resolve(d);
            });
        return defer.promise;
    };


    this.add = function(user) {
        var defer = Q.defer();
        var pGet = this.get(user);
        pGet.then(function(item) {
            if (item) {
                defer.reject(new Error("item exists already"));
            } else {
                console.log("adding item");
                var obj = _.cloneDeep(user);
                if (obj._id === undefined) {
                    obj._id = uuid.v4();
                }
                obj.date_created = moment();
                obj.date_modified = moment();
                itemSave.create(
                    obj, function(eU, itemU) {
                        if (eU) defer.reject(new Error(JSON.stringify(eU.errors)));
                        if (itemU) {
                            defer.resolve(itemU);
                            saveData();
                        } else {
                            defer.reject(new Error('not found'));
                        }
                    });
            }
        }).catch(function(e) {
            console.log("adding item");
            var obj = _.cloneDeep(user);
            if (obj._id === undefined) {
                obj._id = uuid.v4();
            }
            obj.date_created = moment();
            obj.date_modified = moment();
            itemSave.create(
                obj, function(eU, itemU) {
                    if (eU) defer.reject(new Error(JSON.stringify(eU.errors)));
                    if (itemU) {
                        defer.resolve(itemU);
                        saveData();
                    } else {
                        defer.reject(new Error('not found'));
                    }
                });
        });
        return defer.promise;
    };
    this.get = function(user) {
        var defer = Q.defer();
        if (user === undefined) {
            user = {};
        } else if (_.isString(user)) {
            user = {
                username: user
            };
        } else {
            var tmp = user;
            user = {};
            user['username'] = tmp.username;
        }
        itemSave.findOne(user, function(e, items) {
            if (e) {
                defer.reject(e);
            }
            if (items) {
                defer.resolve(items);
            } else {
                defer.reject(new Error('not found'));
            }
        });
        return defer.promise;
    };
    this.init_promise = this.init();
}



module.exports = Users;
