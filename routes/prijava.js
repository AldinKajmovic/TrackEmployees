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


router.get('/', function (req, res, next) {
    res.render('prijava');
});


router.post('/', async function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('SELECT * FROM korisnik WHERE username = $1;', [req.body.username], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            if (result.rows.length === 0) { 
                return res.render('prijava');
            }
            bcrypt.compare(req.body.password, result.rows[0].password, function (err, resCompare) {
                if (resCompare) {
                    const korisnickiPodaci = {
                        id: result.rows[0].id,
                        username: result.rows[0].username,
                        tipKorisnika: result.rows[0].tip_korisnika
                    };

                    res.cookie('loginCookie', korisnickiPodaci);
                    if(korisnickiPodaci.tipKorisnika == 'Admin') return res.redirect("/adminPanel");
                    else if(korisnickiPodaci.tipKorisnika == 'Radnik') return res.redirect("/radnik");
                    else if(korisnickiPodaci.tipKorisnika == 'Menadzer') return res.redirect("/menadzerPanel");
                } else {

                    return res.render('prijava');
                }
            });
        });
    });
});


module.exports = router;
