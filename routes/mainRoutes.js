var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('pages/homepage');
});

module.exports = router;