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

    o.RENAME_CATEGORY = function (category, newCategory) {
        var completeCategory = category;
        completeCategory.newName = newCategory.name;
        return $http.post('/api/ledger/updateCategories', completeCategory);
    };

    o.GETTOTALS = function (start, end, name) {
        var payload = {
            start: start,
            end: end,
            name: name
        };
        return $http.post('/api/ledger/totals', payload);
    };

    return o;
}]);


app.factory('CATEGORY', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/category');
    };

    o.GET = function (category) {
        return $http.post('/api/category/findById', category);
    };

    o.EXISTS = function (category) {
        //console.log(name);
        return $http.post('/api/category/exists', category);
    };

    o.ADD = function (category) {
        return $http.post('/api/category', category);
    };

    o.DELETE = function (category) {
        return $http.delete('/api/category/' + category._id);
    };

    o.UPDATE = function (category) {
        return $http.put('/api/category/' + category._id, category);
    };

    return o;
}]);