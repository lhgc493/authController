var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var appErr = require('./utils/appError');
var errorGlobal = require('./controllers/errorController');
var usuarioRoute = require('./routes/usuarioRoutes')
var app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


app.use('/usuarios', usuarioRoute);
app.all('*', (req, res, next) => {
    var message = `Esta pagina ${req.originalUrl} no existe`;
    next(new appErr(message, 404))
})

app.use(errorGlobal);


module.exports = app;