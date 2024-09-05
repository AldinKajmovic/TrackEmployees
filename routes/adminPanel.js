var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
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

router.get('/logout', function (req, res, next) {
    res.clearCookie('loginCookie');
    res.redirect('/prijava');
});

router.get('/', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }

        client.query('SELECT * FROM korisnik ORDER BY id ASC;', [], (err, korisnikResult) => {
            if (err) {
                done();
                return res.send(err);
            }

            client.query('SELECT * FROM projekti ORDER BY id_projekta ASC;', [], (err, projektiResult) => {
                if (err) {
                    done();
                    return res.send(err);
                }

                client.query('SELECT * FROM klijent;', [], (err, klijentResult) => {
                    if (err) {
                        done();
                        return res.send(err);
                    }

                    client.query('SELECT * FROM qa ORDER BY id ASC;', [], (err, qaResult) => {
                        done();
                        if (err) {
                            return res.send(err);
                        }

                        res.render('adminPanel', {
                            podaci: korisnikResult.rows,
                            projekti: projektiResult.rows,
                            podaciKlijenta: klijentResult.rows,
                            podaciQA: qaResult.rows
                        });
                    });
                });
            });
        });
    });
});

router.put('/modifikujuser', async function (req, res, next) {
    try {
        let forma = req.body;
        let obicnaSifra = forma.passwordKorisnika;
        let nadredjeni = forma.idSupervisor;
        let stringIDkor = req.body.selectKorisnika;

        let intIDkor = parseInt(stringIDkor, 10);

        nadredjeni = nadredjeni === "" ? null : nadredjeni;

        const kriptovanaSifra = await bcrypt.hash(obicnaSifra, 10);

        const updateQuery = 'update korisnik set ime = $1, prezime = $2, username = $3, password = $4, tip_korisnika = $5, id_nadredjeni = $6 where id = $7;';

        const updateResult = await pool.query(updateQuery, [req.body.imeKorisnika, req.body.prezimeKorisnika, req.body.usernameKorisnika, kriptovanaSifra, req.body.typeKorisnika, nadredjeni, intIDkor]);

        const selectQuery = 'select * from korisnik where id = $1;';
        const selectResult = await pool.query(selectQuery, [intIDkor]);

        return res.json({success: true, azuriraniPodaci: selectResult.rows});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error: 'Internal Server Error'});
    }
});

router.get('/getLastID', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('select id from korisnik order by 1 desc limit 1;', [], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            const lastID = result.rows[0].id;
            return res.json({lastID: lastID});
        });
    });
});


router.delete('/:id', function (req, res, next) {
    pool.connect((err, client, done) => {
        const uk = req.params.id;
        if (err) {
            res.send(err);
        }
        client.query('delete from korisnik where id = $1;', [uk], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            return res.status(200).json({success: true});
        });
    });
});


router.post('/dodaj', async function (req, res, next) {
    try {
        let obicnaSifra = req.body.password;
        let nadredjeni = req.body.idNadredjeni || null;

        const kriptovanaSifra = await bcrypt.hash(obicnaSifra, 10);

        await pool.query(
            'INSERT INTO korisnik(ime, prezime, username, password, tip_korisnika, id_nadredjeni) VALUES($1, $2, $3, $4, $5, $6);',
            [req.body.ime, req.body.prezime, req.body.username, kriptovanaSifra, req.body.tipKorisnika, nadredjeni]
        );

        const selectQueryResult = await pool.query(
            'SELECT * FROM korisnik WHERE username = $1;',
            [req.body.username]
        );

        const selectedData = selectQueryResult.rows;

        return res.json(selectedData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error: 'Internal Server Error'});
    }
});

router.post('/dodajProjekt', function (req, res, next) {
    let forma = req.body;
    let iM = forma.idMenadzer;
    let intIM = parseInt(iM, 10);

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }

        const insertProjekatQuery = 'INSERT INTO projekti(naziv_projekta, opis_projekta, startni_datum, zavrsni_datum, id_klijenta) VALUES($1, $2, $3, $4, $5) RETURNING id_projekta, naziv_projekta';

        client.query(insertProjekatQuery, [req.body.naziv, req.body.opis, req.body.startniDatum, req.body.zavrsniDatum, req.body.selectKlijenta], (err, result) => {
            if (err) {
                done();
                return res.send(err);
            }
            const insertedId = result.rows[0].id_projekta;

            const insertTimQuery = 'INSERT INTO tim(id_projekta, id_korisnika, tip_korisnika) VALUES($1, $2, $3)';
            client.query(insertTimQuery, [insertedId, intIM, 'Menadzer'], (err) => {
                done();

                if (err) {
                    return res.send(err);
                }

                return res.json({
                    id: insertedId,
                    naziv: result.rows[0].naziv_projekta,
                    message: "Uspješno unesen projekat i menadžer u bazu podataka!",
                });
            });
        });
    });
});


router.post('/dodijeliProjekt', function (req, res, next) {
    let stringProjekt = req.body.selectProjekt;
    let stringRadnik = req.body.selectRadnika;
    let tipRadnika = req.body.selectRola;

    let intProjekt = parseInt(stringProjekt, 10);
    let intRadnik = parseInt(stringRadnik, 10);

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('INSERT INTO tim(id_projekta, id_korisnika, tip_korisnika) VALUES($1, $2, $3);', [intProjekt, intRadnik, tipRadnika], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            return res.send(`Uspješno dodijeljen ${tipRadnika} odabranom projektu ! `);
        });
    });
});


router.get('/izvjPrisustvo', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        //Upit za sve sate za svaki dan
        client.query(
            'SELECT FLOOR(EXTRACT(EPOCH FROM (vrijeme_odlaska - vrijeme_dolaska)) / 60) / 60 AS broj_radnih_sati, datum from evidencija WHERE (datum BETWEEN $1 AND $2) and id_radnika=$3;',
            [req.query.datumOd, req.query.datumDo, req.query.selectKorisnikaIzvj],
            (err, result) => {
                if (err) {
                    done();
                    res.send(err);
                    return;
                }
                //Upit za sumu svih radnih sati
                client.query(
                    'SELECT SUM(FLOOR(EXTRACT(EPOCH FROM (vrijeme_odlaska - vrijeme_dolaska)) / 60) / 60) AS ukupan_broj from evidencija WHERE (datum BETWEEN $1 AND $2);',
                    [req.query.datumOd, req.query.datumDo],
                    (err, totalResult) => {
                        done();
                        if (err) {
                            res.send(err);
                            return;
                        }

                        const response = {
                            success: true,
                            izvjestaj: result.rows,
                            ukupan_broj: totalResult.rows[0].ukupan_broj,
                        };

                        res.json(response);
                    }
                );
            }
        );
    });
});

router.get('/ucitaniProjekti', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('select * from projekti;', [], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            return res.render('showProjektiAdminPanel', {projektData: result.rows});
        });
    });
});

router.get('/ucitaniTaskovi', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('select * from taskovi;', [], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            return res.render('showTaskoviAdminPanel', {taskData: result.rows});
        });
    });
});


router.get('/ucitaniSati', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('select * from radni_sati;', [], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            return res.render('showSati', {satiData: result.rows});
        });
    });
});


router.post('/azurirajStanjeTaska', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('update taskovi set status_taska = $1 where id_taska = $2;', [req.body.statusTaska, req.body.selectTask], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            return res.json({success: true});
        });
    });
});

router.post('/azurirajStanjeProjekta', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('update projekti set status_projekta = $1 where id_projekta = $2;', [req.body.statusProjekta, req.body.selectProjekt], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            return res.json({success: true});
        });
    });
});


router.post('/odgovor', function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('update qa set odgovor = $1 where id = $2;', [req.body.odgovor, req.body.selectPitanje], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            return res.json({success: true});

        });
    });
});

module.exports = router;
