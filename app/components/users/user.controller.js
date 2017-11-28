'use strict';

const UserModel = require('./user.model');

class UserController {

  static getPlayerFromRetrospective (req, res, next) {

    return UserModel.getPlayerFromRetrospective(req.params.userId, req.params.retrospectiveId)
      .then(playerFound => {
        if (!playerFound) {
          res.status(204);
        } else {
          res.status(200);
        }
        res.send(playerFound);
      })
      .catch(error => {
        next(error);
      });
  }

  static getUser (req, res, next) {
    return UserModel.getUser(req.params.userId)
      .then(userFound => {
        if (!userFound) {
          res.status(204);
          res.send();
        } else {
          res.status(200);
          res.send(userFound);
        }
      })
      .catch(error => {
        next(error);
      });
  }
}

module.exports = UserController;
