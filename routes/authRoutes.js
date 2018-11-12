var express = require('express');
var router = express.Router();
var config = require('../config.json');
var passport = require('passport');
var passportSetup = require('../passport.js');

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/discord', passport.authenticate('discord', {
    scope: ['identify', 'guilds']
}), (req,res) => {res.send('Redirecting to discord..')})

router.get('/discord/redirect', passport.authenticate('discord'), function (req, res) {
    res.redirect('/');
});

module.exports = router;