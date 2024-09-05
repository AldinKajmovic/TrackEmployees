var express = require('express');
var router = express.Router();
const pg = require('pg');
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

let msg = {
    from: '"Menadzer" <menadzer@express.com>',
    to: process.env.EMAIL_USER,
    subject: "Notifikacija",
    text: ""

};

async function sendEmail() {
    try {
        const info = await transporter.sendMail(msg);
        console.log("Poruka poslata: %s", info.messageId);
    } catch (error) {
        console.error("Greška tokom slanja emaila:", error);
    }
}

let pool = new pg.Pool(config);
const concatStream = require('concat-stream'); // Ensure to install this module: npm install concat-stream

router.get('/', function(req, res, next) {
    pool.connect((err, client, done) => {
        const idMenadzera = req.cookies.loginCookie.id;
        if (err) {
            return res.send(err);
        }

        // Prvi upit: Dohvati podatke o menadžeru
        client.query('SELECT * FROM korisnik WHERE id = $1;', [idMenadzera], (err, resultMenadzer) => {
            if (err) {
                done();
                return res.send(err);
            }

            // Drugi upit: Dohvati projekte menadžera
            client.query("SELECT * FROM projekti INNER JOIN tim AS t ON t.id_projekta = projekti.id_projekta AND t.tip_korisnika='Menadzer' AND t.id_korisnika=$1;", [idMenadzera], (err, resultProjekti) => {
                if (err) {
                    done();
                    return res.send(err);
                }

                // Treći upit: Dohvati sve korisnike
                client.query('SELECT * FROM korisnik WHERE id != $1;', [idMenadzera], (err, resultKorisnici) => {
                    if (err) {
                        done();
                        return res.send(err);
                    }

                    // Četvrti upit: Dohvati taskove za određenog menadžera
                    client.query("SELECT task.id_taska,task.naziv, task.opis, task.id_projekta FROM taskovi AS task INNER JOIN tim AS t ON t.id_projekta = task.id_projekta AND t.tip_korisnika='Menadzer' AND t.id_korisnika=$1;", [idMenadzera], (err, resultTaskovi) => {
                        if (err) {
                            done();
                            return res.send(err);
                        }

                        // Peti upit: Dohvati pitanja i odgovore (qa) gdje je id_posiljaoca = $1
                        client.query('SELECT * FROM qa WHERE id_posiljaoc = $1;', [idMenadzera], (err, resultQA) => {
                            if (err) {
                                done();
                                return res.send(err);
                            }

                            // Šesti upit: Dohvati sve podatke gdje je id_primaoca = $1
                            client.query('SELECT * FROM qa WHERE id_primalac = $1;', [idMenadzera], (err, resultPrimaoc) => {
                                done();

                                if (err) {
                                    return res.send(err);
                                }
                                return res.render('menadzerPanel', {
                                    podaciMenadzera: resultMenadzer.rows,
                                    projektiMenadzera: resultProjekti.rows,
                                    podaciKorisnici: resultKorisnici.rows,
                                    taskoviMenadzera: resultTaskovi.rows,
                                    podaciQA: resultQA.rows,
                                    podaciPrimaoc: resultPrimaoc.rows
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


router.post('/dodijeliProjekt', function(req, res, next) {
    let stringProjekt = req.body.selectProjekt;
    let stringRadnik = req.body.selectRadnika;
    let tipRadnika = req.body.selectRola;

    let intProjekt = parseInt(stringProjekt, 10);
    let intRadnik = parseInt(stringRadnik, 10);

    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('INSERT INTO tim(id_projekta, id_korisnika, tip_korisnika) VALUES($1, $2, $3);', [intProjekt, intRadnik, tipRadnika], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            msg.text = `Uspješno dodijeljen ${tipRadnika} odabranom projektu ! `;
            sendEmail();
            return res.send(`Uspješno dodijeljen ${tipRadnika} odabranom projektu ! `);
        });
    });
});

router.get('/ukupniSati/:id', function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.send(err);
        }
        client.query('select sum(broj_sati) as suma from radni_sati where id_projekta = $1;', [req.params.id], (err, result) => {
            done();
            if (err) {
                res.send(err);
            }
            return res.send(`Ukupan broj radnih sati za projekat sa ID-em:${req.params.id} iznosi : ${result.rows[0].suma} ! `);
        });
    });
});


router.get('/izvjestajZaTaskove', function(req, res, next) {
    pool.connect((errBrojac, clientBrojac, doneBrojac) => {
        if (errBrojac) {
            res.send(errBrojac);
            return;
        }

        const queryBrojacStatusa = `
      SELECT
        (SELECT COUNT(*) FROM taskovi WHERE status_taska = 'Zavrsen') AS broj_zavrsenih_zadataka,
        (SELECT COUNT(*) FROM taskovi WHERE status_taska = 'U toku') AS broj_zadataka_u_toku,
        (SELECT COUNT(*) FROM taskovi WHERE status_taska = 'Kasni') AS broj_zadataka_kasni;
    `;

        clientBrojac.query(queryBrojacStatusa, [], (errResultCount, resultBrojac) => {
            doneBrojac();

            if (errResultCount) {
                res.send(errResultCount);
                return;
            }

            pool.connect((errSviPodaci, clientSviPodaci, doneSviPodaci) => {
                if (errSviPodaci) {
                    res.send(errSviPodaci);
                    return;
                }

                const querySviPodaci = `
          SELECT
            taskovi.*
          FROM
            taskovi
          INNER JOIN
            tim AS t ON t.id_projekta = taskovi.id_projekta
          WHERE
            t.id_korisnika = $1;
        `;

                clientSviPodaci.query(querySviPodaci, [req.cookies.loginCookie.id], (errResultAllRows, resultAllRows) => {
                    doneSviPodaci();

                    if (errResultAllRows) {
                        res.send(errResultAllRows);
                        return;
                    }

                    const pdfDoc = new PDFDocument();
                    let pdfContent = '';
                    const pdfStream = pdfDoc.pipe(
                        concatStream(chunk => {
                            pdfContent += chunk.toString('base64');
                        })
                    );

                    pdfStream.on('finish', () => {
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'inline; filename=izvjestaj_taskova.pdf');
                        res.send(Buffer.from(pdfContent, 'base64'));
                    });
                    pdfDoc.text('Izvještaj o taskovima\n\n');
                    pdfDoc.text(`Broj završenih zadataka: ${resultBrojac.rows[0].broj_zavrsenih_zadataka}\n`);
                    pdfDoc.text(`Broj zadataka u toku: ${resultBrojac.rows[0].broj_zadataka_u_toku}\n`);
                    pdfDoc.text(`Broj zadataka koji kasne: ${resultBrojac.rows[0].broj_zadataka_kasni}\n\n`);
                    pdfDoc.end();
                });
            });
        });
    });
});


router.get('/logout', function(req, res, next) {
    res.clearCookie('loginCookie');
    return res.redirect('/prijava');
});

router.post('/pitanje', function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('insert into qa(pitanje,id_primalac,id_posiljaoc) values($1,$2,$3) returning id,id_posiljaoc;', [req.body.pitanje, req.body.selectPrimaoc, req.cookies.loginCookie.id], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            const noviId = result.rows[0].id;
            const idPosiljaoca = result.rows[0].id_posiljaoc;
            return res.json({
                success: true,
                noviId: noviId,
                idPosiljaoca: idPosiljaoca
            });

        });
    });
});

router.post('/odgovor', function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err);
        }
        client.query('update qa set odgovor = $1 where id = $2;', [req.body.odgovor, req.body.selectPitanje], (err, result) => {
            done();
            if (err) {
                return res.send(err);
            }
            return res.json({
                success: true
            });

        });
    });
});

module.exports = router;