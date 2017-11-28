'use strict';

const Retrospective = require('./retrospective');
const Item = require('./../items/item');
const Player = require('./../players/player');

class RetrospectiveModel {

  static getRetrospectiveById (retrospectiveId) {
    return Retrospective.findById(retrospectiveId)
      .then(
        retrospectiveFound => {
          if (!retrospectiveFound) {
            const error = new Error('The retrospective with that id is not found');
            error.title = 'Retrospective not found';
            error.status = 404;
            throw error;
          }
          return retrospectiveFound;
        }
      );
  }

  static createRetrospective (newRetrospective) {
    const retrospective = new Retrospective(newRetrospective);
    return retrospective.save();
  }

  static getItems (currentRetrospectiveId) {
    return Retrospective.findById(currentRetrospectiveId)
      .then(retrospectiveFound => {
        if (!retrospectiveFound) {
          const error = new Error('The retrospective with that id is not found');
          error.title = 'Retrospective not found';
          error.status = 404;
          throw error;
        }
        return Item.find({ 'retrospectiveId': currentRetrospectiveId, 'parent': true })
          .populate('playerId', 'color')
          .populate({
            path: 'children',
            populate: {
              path: 'playerId',
              select: 'color'
            }
          });
      });
  }

  static getRetrospectives () {
    return Retrospective.find().sort({ createDate: -1 })
      .then(retrospectives => {
        return retrospectives;
      });
  }

  static async updateRetrospective (userId, retrospectiveId, field) {
    const opts = { runValidators: true, new: true };
    try {
      const userRetrospective = await Retrospective.find({ _id: retrospectiveId, owner: userId });
      if (!userRetrospective) {
        const error = new Error('The retrospective with that user is not found');
        error.title = 'Retrospective not found';
        error.status = 404;
        throw error;
      }
      const retrospective = await Retrospective.findOneAndUpdate({ _id: retrospectiveId }, { $set: field }, opts);
      return retrospective;
    } catch (err) {
      const error = new Error(err.message);
      error.title = 'Invalid Update';
      error.status = 404;
      throw error;
    }
  }

  static getPlayers (retrospectiveId) {
    return Player.find({ retrospectiveId });
  }
}

module.exports = RetrospectiveModel;
