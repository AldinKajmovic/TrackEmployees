var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


let regRuta = require('./routes/registracija');
let adminPanelRuta = require('./routes/adminPanel');
let menadzerPanelRuta = require('./routes/menadzerPanel');
let radnikRuta = require('./routes/radnik');
let prijavaRuta = require('./routes/prijava');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const projekatCookie = req.cookies?.loginCookie;
    if (req.path === '/prijava' || req.path === '/registracija') {
        return next();
    }
    if (projekatCookie) {
        if (projekatCookie.tipKorisnika === 'Admin') {
            return next();
        } else if (projekatCookie.tipKorisnika === 'Menadzer' && (req.path.startsWith('/menadzerPanel') || req.path === '/menadzerPanel' || req.path.startsWith('/radnik/') || req.path === '/radnik')) {
            return next();
        } else if (projekatCookie.tipKorisnika === 'Radnik' && (req.path.startsWith('/radnik/') || req.path === '/radnik')) {
            return next();
        } else {

            return res.redirect('index', {poruka: "Nemate pristup ovoj ruti ! "});
        }
    } else {

    }
});

app.use('/registracija', regRuta);
app.use('/adminPanel', adminPanelRuta);
app.use('/menadzerPanel', menadzerPanelRuta);
app.use('/radnik', radnikRuta);
app.use('/prijava', prijavaRuta);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
