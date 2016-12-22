// Define dependencies
var express = require('express'),
    router = express.Router(),
    Ledger = require('../../models/ledger.model');


router.get('/ledger', function (req, res, next) {
    Ledger.find(function (err, entries) {
        res.json(entries);
    });
});

router.post('/ledger', function (req, res, next) {
    var ledger = new Ledger(req.body);
    ledger.save(function (err, entry) {
        if (err) { return next(err); }
        res.json(entry);
    });
});

router.get('/ledger/balance', function (req, res, next) {
    var balance = 0;
    Ledger.find(function (err, entries) {
        entries.forEach(function(element) {
            if (element.type === 'deposit') {
                balance += element.amount;
            } else {
                balance -= element.amount;
            }
        }, this);

        res.json({balance: balance});
    });
});

// Export api to router
module.exports = router;