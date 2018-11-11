var express = require('express');
var app = express();
var port = 9998;

// View engine
app.set('view engine', 'ejs');

// Routes
var mainRoutes = require('./routes/mainRoutes.js');

app.use('/', mainRoutes);

app.listen(port, () => console.log(`nobody.life: listening on port ${port}`));