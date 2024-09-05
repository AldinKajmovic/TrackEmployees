var express = require('express');
var router = express.Router();
const pg = require('pg');
const nodemailer = require("nodemailer");
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
  from: '"Radnik" <radnik@express.com>',
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

router.get('/', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }
    const idRadnika = req.cookies.loginCookie.id;

    // Prvi upit za dohvaćanje informacija o radniku
    const queryRadnik = 'SELECT * FROM korisnik WHERE id = $1;';
    client.query(queryRadnik, [idRadnika], (errRadnik, resultRadnik) => {
      done();

      if (errRadnik) {
        return res.send(errRadnik);
      }

      pool.connect((errProjekti, clientProjekti, doneProjekti) => {
        if (errProjekti) {
          return res.send(errProjekti);
        }

        // Drugi upit za dohvaćanje informacija o projektima na kojima radnik radi
        const queryProjekti = 'SELECT * FROM projekti AS p INNER JOIN tim AS t ON t.id_projekta = p.id_projekta WHERE t.id_korisnika = $1;';
        clientProjekti.query(queryProjekti, [idRadnika], (errProjekti, resultProjekti) => {
          doneProjekti();

          if (errProjekti) {
            return res.send(errProjekti);
          }

          pool.connect((errKlijenti, clientKlijenti, doneKlijenti) => {
            if (errKlijenti) {
              return res.send(errKlijenti);
            }

            // Treći upit za dohvaćanje informacija o klijentima
            const queryKlijenti = 'SELECT * FROM klijent INNER JOIN projekti AS p ON p.id_klijenta = klijent.id_klijenta;';
            clientKlijenti.query(queryKlijenti, (errKlijenti, resultKlijenti) => {
              doneKlijenti();

              if (errKlijenti) {
                return res.send(errKlijenti);
              }

              pool.connect((errTaskovi, clientTaskovi, doneTaskovi) => {
                if (errTaskovi) {
                  return res.send(errTaskovi);
                }

                // Četvrti upit za dohvaćanje informacija o taskovima koji su vezani za projekte
                const queryTaskovi = 'SELECT * FROM taskovi INNER JOIN tim AS t ON t.id_projekta = taskovi.id_projekta WHERE t.id_korisnika = $1;';
                clientTaskovi.query(queryTaskovi, [idRadnika], (errTaskovi, resultTaskovi) => {
                  doneTaskovi();

                  if (errTaskovi) {
                    return res.send(errTaskovi);
                  }

                  pool.connect((errQa, clientQa, doneQa) => {
                    if (errQa) {
                      return res.send(errQa);
                    }

                    // Peti upit za dohvaćanje informacija o pitanjima i odgovorima (qa)
                    const queryQa = 'SELECT * FROM qa where id_posiljaoc = $1 or id_primalac = $1;';
                    clientQa.query(queryQa, [idRadnika], (errQa, resultQa) => {
                      doneQa();

                      if (errQa) {
                        return res.send(errQa);
                      }

                      pool.connect((errKorisnici, clientKorisnici, doneKorisnici) => {
                        if (errKorisnici) {
                          return res.send(errKorisnici);
                        }

                        // Šesti upit za dohvaćanje informacija o korisnicima tj. svi korisnici a prvi upit je bio samo za jednog korisnika
                        const queryKorisnici = 'SELECT * FROM korisnik;';
                        clientKorisnici.query(queryKorisnici, (errKorisnici, resultKorisnici) => {
                          doneKorisnici();

                          if (errKorisnici) {
                            return res.send(errKorisnici);
                          }
                          //Prilikom logiranja, uzme se trenutno vrijeme(timestamp) i pošalje u bazu, to se isto radi na odjavi(logout)
                          const queryEvidencija = 'INSERT INTO evidencija (id_radnika, vrijeme_dolaska, datum) VALUES ($1, CURRENT_TIME, CURRENT_DATE);';

                          client.query(queryEvidencija, [idRadnika], (errEvidencija, resultEvidencija) => {
                            if (errEvidencija) {
                              return res.send(errEvidencija);
                            }


                            res.render('radnik', {
                              podaciRadnika: resultRadnik.rows,
                              podaciProjekata: resultProjekti.rows,
                              podaciKlijenta: resultKlijenti.rows,
                              podaciTaskova: resultTaskovi.rows,
                              podaciQA: resultQa.rows,
                              podaciKorisnika: resultKorisnici.rows
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});


router.get('/getProjekt', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom spajanja na bazu podataka:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    client.query('SELECT * FROM projekti where id_klijenta = $1;', [req.query.klijentId], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvođenja SQL upita:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }

      return res.status(200).json(result.rows);
    });
  });
});

router.get('/getTasks', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom spajanja na bazu podataka:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    client.query('SELECT * FROM taskovi WHERE id_projekta = $1;', [req.query.projectId], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvođenja SQL upita:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }

      return res.status(200).json(result.rows);
    });
  });
});


router.post('/dodajTask', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }
    client.query('insert into taskovi(naziv,opis,id_projekta) values($1,$2,$3);', [req.body.nazivTaska, req.body.opisTaska, req.body.selectProjekatTask], (err, result) => {
      done();
      if (err) {
        return res.send(err);
      }
      msg.text = `Uspješno dodat task sa nazivom: ${req.body.nazivTaska}, opis: ${req.body.opisTaska} za projekat sa ID-em: ${req.body.selectProjekatTask}`;
      sendEmail();
      return res.sendStatus(200);
    });
  });
});

router.post('/azurirajStanjeProjekta', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }
    client.query('update projekti set status_projekta = $1 where id_projekta = $2;', [req.body.statusProjekta, req.body.selectProjekt], (err, result) => {
      done();
      if (err) {
        return res.send(err);
      }
      msg.text = `Uspješno je ažurirano stanje projekta sa ID-em ${req.body.selectProjekt} i to stanje je : ${req.body.statusProjekta}`;
      sendEmail();
      return res.render('index', {
        poruka: `Uspješno je ažurirano stanje projekta sa ID-em ${req.body.selectProjekt} i to stanje je : ${req.body.statusProjekta}`
      });
    });
  });

});

router.get('/logout', function(req, res, next) {
  const idRadnika = req.cookies.loginCookie.id;

  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom povezivanja na bazom podataka:', err);
      return res.send(err);
    }

    client.query('UPDATE evidencija SET vrijeme_odlaska = CURRENT_TIME WHERE id_radnika = $1 AND vrijeme_odlaska IS NULL;', [idRadnika], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvršenja SQL upita:', err);
        return res.send(err);
      }

      res.clearCookie('loginCookie');
      return res.redirect('/prijava');
    });
  });
});


router.get('/prikaziTask/:id', function(req, res, next) {
  const idProjekta = req.params.id;


  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom povezivanja na bazom podataka:', err);
      return res.send(err);
    }

    client.query('select * from taskovi where id_projekta = $1;', [idProjekta], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvršenja SQL upita:', err);
        return res.send(err);
      }

      return res.render('showTasks', {
        taskovi: result.rows
      });
    });
  });


});

router.get('/prikaziSate/:id', function(req, res, next) {
  const idProjekta = req.params.id;
  const idRadnika = req.cookies.loginCookie.id;

  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom povezivanja na bazom podataka:', err);
      return res.send(err);
    }

    client.query('SELECT radni_sati.*, projekti.naziv_projekta, taskovi.naziv FROM radni_sati JOIN projekti ON radni_sati.id_projekta = projekti.id_projekta JOIN taskovi ON radni_sati.id_zadatka = taskovi.id_taska WHERE radni_sati.id_projekta = $1 AND radni_sati.id_radnika = $2;', [idProjekta, idRadnika], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvršenja SQL upita:', err);
        return res.send(err);
      }

      return res.render('showHours', {
        sati: result.rows
      });
    });
  });


});

router.get('/brzoParsiranje', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom povezivanja na bazu podataka:', err);
      return res.send(err);
    }

    const upit = `
    INSERT INTO radni_sati (id_radnika, id_projekta, datum, broj_sati, id_zadatka)
    SELECT 
      $1 AS id_radnika,
      projekti.id_projekta, 
      CURRENT_DATE AS datum, 
      $2 AS broj_sati,
      taskovi.id_taska
    FROM 
      taskovi
    JOIN 
      projekti ON taskovi.id_projekta = projekti.id_projekta
    WHERE 
      taskovi.naziv = $3 AND projekti.naziv_projekta = $4
  `;

    const params = [req.cookies.loginCookie.id, req.query.sati, req.query.task, req.query.projekat];

    client.query(upit, params, (error, result) => {
      done();

      if (error) {
        console.error('Greška prilikom izvršavanja upita:', error);
        return res.send(error);
      }

      return res.send('Uspješno izvršen upit.');
    });
  });

});

router.post('/dodajRadneSate', function(req, res, next) {
  const idRadnika = req.cookies.loginCookie.id;

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }
    client.query('insert into radni_sati(id_radnika,id_projekta,datum,id_zadatka,broj_sati) values($1,$2,CURRENT_DATE,$3,$4);', [idRadnika, req.body.selectIDprojekt, req.body.selectTask, req.body.hours], (err, result) => {
      done();
      if (err) {
        return res.send(err);
      }
      msg.text = `Uspješno je dodato ${req.body.hours} sati za radnika sa ID-em: ${idRadnika} za projekat sa IDem: ${req.body.selectIDprojekt} za task sa ID-em: ${req.body.selectTask}`;
      sendEmail();
      return res.render('index', {
        poruka: "Uspješno uneseni radni sati !"
      });
    });
  });


});


router.post('/promjeniStanjeTaska', function(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Greška prilikom povezivanja na bazom podataka:', err);
      return res.send(err);
    }

    client.query('update taskovi set status_taska =$1 where id_taska = $2;', [req.body.statusTaska, req.body.selectTaskUpdate], (err, result) => {
      done();

      if (err) {
        console.error('Greška prilikom izvršenja SQL upita:', err);
        return res.send(err);
      }
      msg.text = `Uspješno je ažurirano stanje taska sa ID-em ${req.body.selectTaskUpdate} i to stanje je : ${req.body.statusTaska}`;
      sendEmail();
      return res.render('index', {
        poruka: `Uspješno je ažurirano stanje taska sa ID-em ${req.body.selectTaskUpdate} i to stanje je : ${req.body.statusTaska}`
      });
    });
  });


});

router.post('/pitanje', function(req, res, next) {
  const idRadnika = req.cookies.loginCookie.id;
  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }
    client.query('insert into qa(pitanje,id_primalac,id_posiljaoc) values($1,$2,$3) returning id,id_posiljaoc;', [req.body.pitanje, req.body.selectPrimaoc, idRadnika], (err, result) => {
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


module.exports = router;