const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const app = express();
const nodemailer = require("nodemailer");

const session = require('express-session');

app.use(express.json());

app.use('',express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/inscription.html', (request, response) => {
	return response.sendFile('inscription.html', { root: '.' });
});

app.get('/connection.html', (request, response) => {
	return response.sendFile('connection.html', { root: '.' });
});

app.get('/index.html', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/game.html', (request, response) => {
	return response.sendFile('game.html', { root: '.' });
});

app.get('/parametres.html', (request, response) => {
	return response.sendFile('parametres.html', { root: '.' });
});

app.get('/test.html', (request, response) => {
	return response.sendFile('sinscrire.html', { root: '.' });
});

app.get('/testconn.html', (request, response) => {
	return response.sendFile('connection.html', { root: '.' });
});

const generateSecretKey = (length) => {
	length = length || 32;

	return crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length);
};

app.use(session({
	secret: generateSecretKey(64),
	resave: false,
	saveUninitialized: true,
}));


//inscription

app.post('/api/signup', (req, res) => {
    const data = req.body;
console.log(data)
    const passwordHashed = CryptoJS.SHA256(data.password).toString();

    db.get('SELECT * FROM account WHERE name = ?', [data.name], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (row) {
            return res.status(400).send("Le nom d'utilisateur existe déjà !");
        }

        db.get('SELECT * FROM account WHERE email = ?', [data.email], (err, row) => {
            if (err) {
                console.log("2");
                return res.status(500).send("Erreur interne du serveur");
            }

            if (row) {
                return res.status(400).send("L'email existe déjà !");
            }

            const randomId = Math.floor(Math.random() * 1000000000);
            db.run(`INSERT INTO account (id, name, password, email) VALUES (?, ?, ?, ?)`,
                [randomId, data.name, passwordHashed, data.email], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Erreur interne du serveur");
                    }
                    res.status(200).send("Compte créé !");
                });
        });
    });
});

//connection

app.post('/api/signin', (req, res) => {
	const { email, password } = req.body;

	const passwordHashed = CryptoJS.SHA256(password).toString();

	db.get("SELECT * FROM account WHERE email = ? AND password = ?", [email, passwordHashed], (err, row) => {
		if (err) {
			return res.status(500).send("Erreur interne du serveur");
		}
		if (row) {
			req.session.email = row.email;
console.log("connecté")

			return res.sendStatus(200);
		} else {
			return res.status(401).send("Authentification échouée");
		}
	});
});

app.post('/api/setAccount', (req, res) => {
	const newData = req.body;
	const name = newData.name;
	const password = newData.password;
	const email = newData.email;

	console.log(name);
	console.log(password);
	console.log(email);

	const id = Math.random().toString(36).substr(2, 9);

	db.run(`INSERT INTO account (name, password, email, id) VALUES (?, ?, ?, ?)`,
		[name, password, email, id], (err) => {
			if (err) {
				console.error(err);
			}
		});
});

//profile

app.get("/api/profile", (req, res) => {
	const email = req.session.email;

	db.get('SELECT * FROM account WHERE email = ?', [email], (err, userRow) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: 'Erreur lors de la récupération des informations de l\'utilisateur.' });
		}
		if (userRow) {
			const userProfile = {
				email: email,
				name: userRow.name,
			};
			res.json(userProfile);
		} else {
			console.log("Non connecté");
		}
	});
});



// Configurer les en-têtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


const port = '4000';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));