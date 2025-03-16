var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const pg = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

let pool = new pg.Pool(config);

const kriptujSifru = async (obicnaSifra) => {
    return bcrypt.hash(obicnaSifra, saltRounds);
};


router.get('/', function(req, res, next) {
    res.render('registracija');
});

router.post('/', async function(req, res, next) {
    const kriptovanaSifra = await kriptujSifru(req.body.password);

    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('insert into korisnik(ime,prezime,username,password,tip_korisnika) values($1,$2,$3,$4,$5);', [req.body.ime, req.body.prezime, req.body.username, kriptovanaSifra, 'Radnik'], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            res.redirect('prijava');
        });
    });

});

module.exports = router; 