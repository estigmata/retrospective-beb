'use strict';

const Player = require('./../players/player');
const User = require('./user');
class UserModel {

  static getPlayerFromRetrospective (userId, retrospectiveId) {
    return Player.findOne({ userId, retrospectiveId });
  }
  static getUser (userId) {
    return User.findById(userId);
  }
}

module.exports = UserModel;
