'use strict';

const emitter = require('./../../events/emmiter');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RetrospectiveSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    categories: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        color: {
          type: String,
          required: true,
          trim: true
        }
      },
      { _id: true }
    ],
    maxVotes: {
      type: Number,
      default: 5
    },
    createDate: {
      type: Date,
      default: Date.now
    },
    state: {
      type: String,
      enum: ['Items', 'Grouping', 'Votes', 'Actions', 'Done'],
      default: 'Items'
    }
  }
);

RetrospectiveSchema.post('findOneAndUpdate', item => {
  emitter.emit('updateStateRetrospective', item);
});

module.exports = RetrospectiveSchema;
