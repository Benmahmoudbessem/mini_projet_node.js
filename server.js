const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_tache');

app.use(session({
  secret: 'votre_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/', authRoutes);
app.use('/', taskRoutes);

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Nouvelle connexion WebSocket');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});