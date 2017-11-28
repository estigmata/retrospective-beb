'use strict';

const PlayerModel = require('./player.model');

class PlayerController {
  static getPlayer (req, res, next) {
    return PlayerModel.getPlayer(req.params.playerId)
      .then(player => {
        res.status(200)
          .send(player);
      })
      .catch(error => {
        next(error);
      });
  }
}

module.exports = PlayerController;
