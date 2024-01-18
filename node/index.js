const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const port = 3000;

let usuaris = [];
let sockets = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        // Elimina usuari de la llista de usuaris
        console.log('user disconnected');
        usuaris = usuaris.filter(p => p.id !== socket.id);
        delete sockets[socket.id];
        console.log(usuaris);
    });

    socket.on('entrar-sala', (nom) => {
        // Afegeix usuari a la llista de usuaris
        usuaris.push({ id: socket.id, nom: nom });
        sockets[socket.id] = socket;
        io.emit('actualitzar-usuaris', usuaris);
        console.log(usuaris);
    });

    socket.on('connectar-amb-usuari', (id, data) => {
        // Envia missatge a l'usuari amb id
        sockets[id].emit('connectar-amb-usuari', socket.id, data);
    });
});

server.listen(port, () => {
    console.log(`server running at port ${port}`);
});