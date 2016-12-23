app.controller('MainCtrl', ['$scope', 'LEDGER', 'CATEGORY', function ($scope, LEDGER, CATEGORY) {

    // Type options
    $scope.typeOptions = ['type', 'deposit', 'withdrawl'];

    // Alerts
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Check if dollar amount is positive or negative
    $scope.positiveBalance = function (amount) {
        if (amount <= 0) {
            return false;
        } else {
            return true;
        }
    };

    // Function to update existing entry
    $scope.updateEntry = function (entry) {
        LEDGER.UPDATE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

    };

    // Function to delete an entry
    $scope.delete = function (entry) {
        LEDGER.DELETE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to add a new entry
    $scope.add = function () {
        if (!$scope.newEntry.category || $scope.newEntry.category === '' || $scope.newEntry.category === 'category') {
            $scope.alerts.push({type: 'danger', msg: 'You must select a category for this entry'});
            return;
        }
        if (!$scope.newEntry.type || $scope.newEntry.type === '' || $scope.newEntry.type === 'type') {
            $scope.alerts.push({type: 'danger', msg: 'You must select a type for this entry'});
            return;
        }
        LEDGER.ADD($scope.newEntry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };
    
    // Run on page load
    function init() {
        // Get all entries
        LEDGER.GETALL().then(function successCallback(res) {
            $scope.entries = res.data;
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        // Get the current running balance
        LEDGER.CURRENTBALANCE().then(function successCallback(res) {
            $scope.currentBalance = res.data.balance;
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        // Get all categories
        CATEGORY.GETALL().then(function successCallback(res) {
            // Category options
            $scope.categoryOptions = [];
            res.data.forEach(function(element) {
                $scope.categoryOptions.push(element.name);
            }, this);
            // Sort category options
            $scope.categoryOptions = $scope.categoryOptions.sort();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        // Initialize new entry fields
        $scope.newEntry = {
            category: 'category',
            type: 'type'
        };

        
    }

    init();
}]);