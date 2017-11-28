'use strict';

const mongoose = require('mongoose');
const emitter = require('./../../events/emmiter');

const Schema = mongoose.Schema;

const userRoles = ['Moderator', 'Participant'];
const playerSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Anonymus',
      trim: true
    },
    retrospectiveId: {
      type: Schema.Types.ObjectId,
      ref: 'retrospectives'
    },
    votes: [{
      itemId: {
        type: Schema.Types.ObjectId,
        ref: 'items'
      },
      _id: false,
      numberVotes: {
        type: Number,
        default: 0
      }
    }],
    maxVotes: {
      type: Number
    },
    color: {
      type: String,
      default: '#ffffff',
      trim: true,
      required: true
    },
    role: {
      type: String,
      enum: userRoles,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  }
);

playerSchema.methods.updateVotes = function (itemId, voteValue) {
  const foundVote = this.votes.find(rate => rate.itemId.toString() === itemId);
  if (foundVote !== undefined) {
    foundVote.numberVotes += voteValue;
    return this.save();
  } else {
    this.votes.push({ itemId: itemId.toString(), numberVotes: 1 });
    return this.save();
  }
};

playerSchema.methods.canVote = function (itemId, playerId, voteValue) {
  let totalVotes = 0;
  this.votes.forEach(vote => {
    totalVotes += vote.numberVotes;
  });
  const foundVote = this.votes.find(rate => rate.itemId.toString() === itemId);
  const res = totalVotes + voteValue;
  if (res >= 0 && this.maxVotes >= res) {
    if (foundVote === undefined && voteValue > 0) {
      return Promise.resolve(true);
    }
    if (foundVote !== undefined && (foundVote.numberVotes + voteValue) >= 0) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  } else {
    return Promise.resolve(false);
  }
};

playerSchema.post('save', player => {
  emitter.emit('savePlayer', player);
});

module.exports = playerSchema;
