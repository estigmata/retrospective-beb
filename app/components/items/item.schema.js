'use strict';

const mongoose = require('mongoose');
const emitter = require('./../../events/emmiter');

const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    summary: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    categoryId: {
      type: Schema.Types.ObjectId
    },
    retrospectiveId: {
      type: Schema.Types.ObjectId,
      ref: 'retrospective'
    },
    children: [{
      type: Schema.Types.ObjectId,
      ref: 'item'
    }],
    votes: {
      type: Number,
      default: 0
    },
    actionItem: {
      type: String,
      required: false,
      trim: false
    },
    parent: {
      type: Boolean,
      required: false,
      default: true
    },
    playerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'player'
    }
  }
);

itemSchema.methods.updateVotes = function (voteValue) {
  const res = this.votes + voteValue;
  if (res >= 0) {
    this.votes += voteValue;
    return this.save();
  }
  const error = new Error('Invalid vote on this item');
  error.title = 'Invalid vote';
  error.status = 400;
  return Promise.reject(error);
};

itemSchema.post('save', item => {
  item
    .populate({
      path: 'children playerId',
      populate: {
        path: 'playerId' }
    })
    .execPopulate()
    .then(
      itemPopulate => {
        emitter.emit('saveItem', itemPopulate);
      });
});

itemSchema.post('findOneAndRemove', item => {
  emitter.emit('deleteItem', item);
});

itemSchema.post('findOneAndUpdate', item => {
  item
    .populate({
      path: 'children playerId',
      populate: {
        path: 'playerId' }
    })
    .execPopulate()
    .then(
      itemPopulate => {
        emitter.emit('updateItem', itemPopulate);
      });
});

module.exports = itemSchema;
