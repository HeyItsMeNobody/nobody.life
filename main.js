var express = require('express');
var app = express();
var port = 9998;
var cookieSession = require('cookie-session');
var config = require('./config.json');
var passport = require('passport');
var bodyParser = require('body-parser');

// View engine
app.set('view engine', 'ejs');

// Cookie session
app.use(cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [config.cookieSession.cookieKey]
}));
// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
var mainRoutes = require('./routes/mainRoutes.js');
var authRoutes = require('./routes/authRoutes.js');
var shortenerRoutes = require('./routes/shortenerRoutes.js');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/shortener', shortenerRoutes);

app.listen(port, () => console.log(`nobody.life: listening on port ${port}`));