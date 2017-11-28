'use strict';

const emitter = require('./../events/emmiter');

module.exports = io => {
  emitter.on('updateItem', item => {
    io.to(item.retrospectiveId).emit('itemUpdate', item);
  });

  emitter.on('deleteItem', item => {
    io.to(item.retrospectiveId).emit('itemDelete', item);
  });

  emitter.on('saveItem', item => {
    io.to(item.retrospectiveId).emit('itemSave', item);
  });
};
