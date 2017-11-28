'use strict';

const RetrospectiveModel = require('./retrospective.model');
const PlayerModel = require('./../players/player.model');

class RetrospectiveController {

  static getRetrospective (req, res, next) {

    return RetrospectiveModel.getRetrospectiveById(req.params.retrospectiveId)
      .then(retrospectiveFound => res.status(200)
        .send(retrospectiveFound)
      )
      .catch(error => {
        next(error);
      });
  }

  static createNewRetrospective (req, res, next) {
    return RetrospectiveModel.createRetrospective(req.body)
      .then(savedRetrospective => res.status(200)
        .send(savedRetrospective)
      )
      .catch(error => {
        error.status = 400;
        error.title = 'The retrospective could not be created';
        next(error);
      });
  }

  static createAnonymousPlayer (req, res, next) {
    req.body.retrospectiveId = req.params.retrospectiveId;
    return PlayerModel.createPlayer(req.body)
      .then(player => {
        if (player.userId) {
          res.status(201);
          res.send();
        } else {
          req.body = player;
          res.status = 200;
          next();
        }
      })
      .catch(error => {
        next(error);
      });
  }

  static getItems (req, res, next) {
    return RetrospectiveModel.getItems(req.params.retrospectiveId)
      .then(items => {
        res.status(200)
          .send(items);
      })
      .catch(error => {
        next(error);
      });
  }

  static createGroup (req, res, next) {
    return RetrospectiveModel.createGroup(req.params.retrospectiveId, req.body)
      .then(newGroup => {
        res.status(200)
          .send(newGroup);
      })
      .catch(error => {
        next(error);
      });
  }

  static getRetrospectives (req, res, next) {
    return RetrospectiveModel.getRetrospectives()
      .then(restrospectives => {
        res.status(200)
          .send(restrospectives);
      })
      .catch(error => {
        next(error);
      });
  }

  static getPlayers (req, res, next) {
    return RetrospectiveModel.getPlayers(req.params.retrospectiveId)
      .then(players => {
        res.status(200)
          .send(players);
      })
      .catch(error => {
        next(error);
      });
  }

  static updateRetrospectiveById (req, res, next) {
    return RetrospectiveModel.updateRetrospective(req.body.owner, req.params.retrospectiveId, req.body)
      .then(restrospectives => {
        res.status(200)
          .send(restrospectives);
      })
      .catch(error => {
        next(error);
      });
  }
}
module.exports = RetrospectiveController;
