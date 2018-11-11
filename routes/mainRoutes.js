var express = require('express');
var router = express.Router();
var config = require('../config.json');
var mysql =  require('mysql');
var conn = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
conn.connect();

//INSERT INTO projects_html (html) VALUES ('<div class="card"><div class="card-header">nobody.life</div><div class="card-main"><div class="card-main-description">The website you are on right now that i use to share most of my projects.<br/>Links:<br/><a href="https://github.com/HeyItsMeNobody/nobody.life">Github</a></div></div></div><br/>')

router.get('/', function (req, res) {
    conn.query('SELECT * FROM `projects_html`', function (error, results, fields) {
        if (error) throw error;
        res.render('pages/homepage', { projects: results });
    });
});

module.exports = router;