app.controller('MainCtrl', ['$scope', '$rootScope', 'LEDGER', 'CATEGORY', function ($scope, $rootScope, LEDGER, CATEGORY) {

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
            LEDGER.CURRENTBALANCE().then(function successCallback(res) {
                $rootScope.currentBalance = res.data.balance;
                init();
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
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
            LEDGER.CURRENTBALANCE().then(function successCallback(res) {
                $rootScope.currentBalance = res.data.balance;
                init();
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };
    
    // Run on page load
    function init() {
        // Get all entries
        LEDGER.GETALL().then(function successCallback(res) {
            $scope.entries = res.data;
            if (res.data.length > 0) {
                $scope.entriesExist = true;
            } else {
                $scope.entriesExist = false;
            }
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
            $scope.categoryOptions.push('category');
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

app.controller('jumboCtrl', ['$scope', '$rootScope', 'LEDGER', function ($scope, $rootScope, LEDGER) {
    // Check if dollar amount is positive or negative
    $scope.positiveBalance = function (amount) {
        if (amount <= 0) {
            return false;
        } else {
            return true;
        }
    };
    function init() {
        // Get the current running balance
        LEDGER.CURRENTBALANCE().then(function successCallback(res) {
            $rootScope.currentBalance = res.data.balance;
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
        
    }

    init();
}]);

app.controller('tabsCtrl', ['$scope', '$state', '$window', function ($scope, $state, $window) {
    $scope.changeState = function (state) {
        $state.go(state);
    };

    $scope.tabs = [
        { title:'Main', state:'main', active: true},
        { title:'Categories', state:'categories'},
        { title:'Analysis', state:'analysis'}
    ];

}]);

app.controller('CategoryCtrl', ['$scope', 'CATEGORY', 'LEDGER', function ($scope, CATEGORY, LEDGER) {
    // Update category
    $scope.updateCategory = function (category) {
        CATEGORY.GET(category).then(function successCallback(res) {
            LEDGER.RENAME_CATEGORY(res.data, category).then(function successCallback(res) {
                CATEGORY.UPDATE(category).then(function successCallback(res) {
                    init();
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to delete a category
    $scope.delete = function (entry) {
        CATEGORY.DELETE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to add a new entry
    $scope.add = function () {
        if (!$scope.category.name || $scope.category.name === '') {
            $scope.alerts.push({type: 'danger', msg: 'You cannot add a blank category'});
            return;
        }

        CATEGORY.EXISTS($scope.category).then(function successCallback(res) {
            if (res.data.exists === true) {
                $scope.alerts.push({type: 'danger', msg: 'You cannot add duplicate category'});
                return;                
            } else {
                CATEGORY.ADD($scope.category).then(function successCallback(res) {
                    init();
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }
        }, function errorCallback(res) {    
            console.log(res.data.status);
        });

    };

    // Close alerts
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    function init() {
        // Get the current categories
        CATEGORY.GETALL().then(function successCallback(res) {
            $scope.categories = res.data;
            if (res.data.length > 0) {
                $scope.categoriesExist = true;
            } else {
                $scope.categoriesExist = false;
            }
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        $scope.alerts = [];

        $scope.category = {};
    }

    init();
}]);

app.controller('AnalysisCtrl', ['$scope', 'CATEGORY', 'LEDGER', function ($scope, CATEGORY, LEDGER) {
    $scope.getTotal = function (transactions) {
        var total = 0;
        transactions.forEach(function(element) {
            total += element.amount;
        }, this);

        return total;
    };

    $scope.getAvg = function (transactions) {
        var total = $scope.getTotal(transactions);
        var length = transactions.length;
        var avg = total / length;

        return avg;
    };

    function init() {
        CATEGORY.GETALL().then(function successCallback(res) {
            $scope.categories = res.data;
            $scope.completeCategories = [];
            $scope.today = new Date();
            $scope.lastYear = new Date();
            $scope.lastYear.setDate($scope.today.getDate() - 365);
            $scope.categories.forEach(function(element) {
                var cat = element;
                LEDGER.GETTOTALS($scope.lastYear, $scope.today, element.name).then(function successCallback(res) {
                    cat.transactions = res.data;
                    $scope.completeCategories.push(cat);
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }, this);
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    }

    init();
}]);