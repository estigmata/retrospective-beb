'use strict';

const emitter = require('./../events/emmiter');

module.exports = io => {
  emitter.on('savePlayer', player => {
    io.to(player.retrospectiveId).emit('playerSave', player);
  });
};
