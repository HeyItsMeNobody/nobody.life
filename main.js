var express = require('express');
var app = express();
var port = 9998;
var cookieSession = require('cookie-session');
var config = require('./config.json');
var passport = require('passport');

// View engine
app.set('view engine', 'ejs');

// Cookie session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.cookieSession.cookieKeys]
}));
// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
var mainRoutes = require('./routes/mainRoutes.js');
var authRoutes = require('./routes/authRoutes.js');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => console.log(`nobody.life: listening on port ${port}`));