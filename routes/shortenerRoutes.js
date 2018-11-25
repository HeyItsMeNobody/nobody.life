var express = require('express');
var router = express.Router();
var config = require('../config.json');
var mysql =  require('mysql');
var getConnection = require('../mysqlPool.js');
var validUrl = require('valid-url');
var shortid = require('shortid');

//INSERT INTO projects_html (html) VALUES ('<div class="card"><div class="card-header">nobody.life</div><div class="card-main"><div class="card-main-description">The website you are on right now that i use to share most of my projects.<br/>Links:<br/><a href="https://github.com/HeyItsMeNobody/nobody.life">Github</a></div></div></div><br/>')

router.get('/', function (req, res) {
    res.render('pages/shortener', {user: req.user});
});
router.get('/:id', function (req, res) {
    getConnection(function(err, conn) {
        conn.query(`SELECT * FROM shortener WHERE id = '${req.params.id}';`, function (error, result, fields) {
            if (error) throw error;
            if (result.length > 0) {
                res.redirect(result[0].url);
            } else {
                res.send('Unknown id!');
            }
        });
    });
});
router.post('/api/new', function(req, res) {
    if (req.body.url) {
        var id = shortid.generate();
        var url = req.body.url;
        getConnection(function(err, conn) {
            conn.query(`SELECT 1 FROM shortener WHERE id = '${id}';`, function(error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    res.json({ failed: 'yes', reason: 'id already exists' });
                } else {
                    if (validUrl.isUri(url)) {
                        conn.query(`INSERT INTO shortener VALUES ('${id}', '${url}')`);
                        res.json({ failed: 'no', reason: 'everything was valid', id: id });
                    } else {
                        res.json({ failed: 'yes', reason: 'not a valid url' });
                    }
                }
            });
        });
    } else {
        res.json({ failed: 'yes', reason: 'No id and/or url provided' })
    }
});

module.exports = router;