(function() {
    angular
        .module('dispensa')
        .factory('receipt', ['$rootScope', '$q', 'persist', 'uuid', 'item', Receipt]);

    function Receipt($rootScope, $q, persist, uuid, item) {

        var current = _new();

        return {
            current: current,
            items: currentItems,
            setCurrent: setCurrent,
            newReceipt: _new,
            remove: remove,
            addItem: addItem,
            reset: reset
        };

        function addItem(oItem) {
            var defer = $q.defer();
            if (oItem === undefined) {
                oItem = item.newItem();
            }
            var existing = _.chain(current.items)
                .filter(function(existing) {
                    return existing.id === item.id;
                })
                .first()
                .value();
            if (existing !== undefined && existing.id === oItem.id) {
                _.assign(existing, oItem);
            } else {
                //todo: add check if item exists
                current.items.push(_.clone(oItem));
            }
            defer.resolve(oItem);
            return defer.promise;
        }


        function remove(oItem) {
            var defer = $q.defer();
            oItem.is_delete = true;
            var it = oItem;

            var res = _.chain(list)
                .remove(function(it) {
                    return it.id === oItem.id;
                })
                .value();
            if (res !== undefined && res.length > 0) {
                persist();
                defer.resolve(res);
            } else {
                defer.reject(new Error('Nothing to remove'));
            }
            return defer.promise;
        };


        function reset() {
            setCurrent(_new());
        }

        function setCurrent(receipt) {
        	console.log(receipt);
        	if(receipt !== undefined){
        		receipt = _.cloneDeep(receipt);
			}
            receipt.type = 'receipt';
            _.forEach(_.keys(current), function(key) {
                if (key !== 'items') {
                    current[key] = undefined;
                }
            });
            _.remove(current.items);
            _.assign(current.items, receipt.items);
            _.merge(current, receipt);
            if(current !== undefined && current.items !== undefined && current.items[0] !== undefined){
            	item.setCurrent(current.items[0]);
			}
            $rootScope.$broadcast('receipt.set.current', current);
        }

        function _new() {
            var receipt = {
                type: 'receipt',
                id: uuid.newUuid(),
                store: undefined,
                store_label: undefined,
                receipt: undefined,
                city: undefined,
                date: moment().format('YYYY-MM-DD'),
                items: []
            };
            return receipt;
        }


        function currentItems() {
            return current.items;
        }
    }
})();
