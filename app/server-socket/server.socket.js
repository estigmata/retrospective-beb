'use strict';

const http = require('http');
const socketIo = require('socket.io');
const itemSocket = require('./item.socket');
const retrospectiveSocket = require('./retrospective.socket');
const playerSocket = require('./player.socket');

module.exports = app => {
  const server = http.createServer(app);
  const io = socketIo(server);

  itemSocket(io);
  retrospectiveSocket(io);
  playerSocket(io);

  io.on('connection', socketClient => {
    socketClient.on('startSocketClient', player => {
      if (player) {
        socketClient.join(player.retrospectiveId);
      }
    });

    socketClient.on('editionStartItem', item => {
      socketClient.broadcast.emit('editionStartItem', item);
    });

    socketClient.on('cancelCreateEditItem', item => {
      socketClient.broadcast.emit('cancelCreateEditItem', item);
    });

    socketClient.on('itemCreate', item => {
      socketClient.broadcast.emit('itemCreate', item);
    });

    socketClient.on('disconnect', () => {
      socketClient.leave(socketClient.room);
    });
  });
  return server;
};
