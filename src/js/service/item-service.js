(function() {
    angular
        .module('dispensa')
        .factory('item', ['$rootScope', 'persist', 'uuid', Item]);

    function Item($rootScope, persist, uuid) {
        var current = _new();
        return {
            current: current,
            setCurrent: setCurrent,
            reset: reset,
            newItem: _new
        };

        function setCurrent(item) {
            item.type = 'item';
            _.forEach(_.keys(current), function(key) {
                current[key] = undefined;
            });
            _.merge(current, item);
            $rootScope.$broadcast('item.set.current', current);
        }

        function reset() {
            setCurrent(_new());
        }

        function _new() {
            var item = {
                type: 'item',
                id: uuid.newUuid(),
                name: undefined,
                brand: undefined,
                label: undefined,
                count: undefined,
                price: undefined,
            };
            return item;
        }
    }


})();
