var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pg = require('pg');


const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
require('dotenv').config();
let pool = new pg.Pool(config);

const kriptujSifru = async (obicnaSifra) => {
    return new Promise((resolve, reject) => {

        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) reject(err);
            bcrypt.hash(obicnaSifra, salt, function(err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });

    });

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