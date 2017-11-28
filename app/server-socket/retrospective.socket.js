'use strict';

const emitter = require('./../events/emmiter');

module.exports = io => {
  emitter.on('updateStateRetrospective', retrospective => {
    io.to(retrospective._id).emit('updateStateRetrospective', retrospective);
  });
};
