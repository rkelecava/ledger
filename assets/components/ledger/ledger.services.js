app.factory('LEDGER', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/ledger');
    };

    o.CURRENTBALANCE = function () {
        return $http.get('/api/ledger/balance');
    };

    o.UPDATE = function (entry) {
        return $http.put('/api/ledger/' + entry._id, entry);
    };

    o.DELETE = function (entry) {
        return $http.delete('/api/ledger/' + entry._id);
    };

    o.ADD = function (entry) {
        return $http.post('/api/ledger', entry);
    };

    return o;
}]);


app.factory('CATEGORY', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/category');
    };

    return o;
}]);