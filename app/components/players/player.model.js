'use strict';

const Player = require('./player');
const Retrospective = require('./../retrospectives/retrospective');
const Color = require('../../helpers/randon-color');
class PlayerModel {

  static updatePlayerVotes (itemId, playerId, voteValue) {
    return Player.findById(playerId)
      .then(player => {
        if (!player) {
          const error = new Error('The player with that id is not found');
          error.title = 'Player not found';
          error.status = 404;
          throw error;
        }
        return player.updateVotes(itemId.toString(), voteValue);
      });
  }

  static validatePlayerVote (itemId, playerId, voteValue) {
    return Player.findById(playerId.toString())
      .then(player => {
        if (!player) {
          const error = new Error('The player with that id is not found');
          error.title = 'Player not found';
          error.status = 404;
          throw error;
        }
        return player.canVote(itemId.toString(), playerId, voteValue);
      })
      .then(res => {
        if (res) {
          return Promise.resolve();
        } else {
          const error = new Error('User can not vote');
          error.title = 'Invalid Vote';
          error.status = 400;
          throw error;
        }
      });
  }

  static createPlayer (anonymusPlayer) {
    return Retrospective.findById(anonymusPlayer.retrospectiveId)
      .then(
        retrospectiveFound => {
          if (!retrospectiveFound) {
            const error = new Error('The retrospective with that id is not found');
            error.title = 'Retrospective not found';
            error.status = 404;
            throw error;
          }
          anonymusPlayer.maxVotes = retrospectiveFound.maxVotes;
          anonymusPlayer.color = Color.generateColor();
          const player = new Player(anonymusPlayer);
          return player.save();
        }
      );
  }
  static getPlayer (playerId) {
    return Player.findById(playerId)
      .then(playerFound => {
        if (!playerFound) {
          const error = new Error('The Player with that id is not found');
          error.title = 'Player not found';
          error.status = 404;
          throw error;
        }
        return playerFound;
      });
  }

  static findPlayerFromUser (userId, retrospectiveId) {
    return Player.findOne({ retrospectiveId, userId });
  }
}

module.exports = PlayerModel;
