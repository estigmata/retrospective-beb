'use strict';

const jsonWebToken = require('jsonwebtoken');
const SECRET = require('./../environments/config');
const Item = require('./../components/items/item');
const PlayerModel = require('./../components/players/player.model');

function validateAuthorization (req, res, next) {
  if (!req.get('authorization')) {
    const error = new Error('No token provided');
    error.title = 'Authorization Required';
    error.status = 401;
    return next(error);
  }
  try {
    const token = req.get('authorization');
    const tokenDecoded = jsonWebToken.verify(token.split(' ')[1], SECRET);
    req.body.owner = tokenDecoded.userId;
    return next();
  } catch (error) {
    error.title = 'Failed to authenticate token';
    error.status = 401;
    return next(error);
  }
}

function getUserAuthorization (req, res, next) {
  if (req.get('authorization')) {
    try {
      const token = req.get('authorization');
      const tokenDecoded = jsonWebToken.verify(token.split(' ')[1], SECRET);
      req.body.userId = tokenDecoded.userId;
    } catch (error) {
      error.title = 'Failed to authenticate token';
      error.status = 401;
      return next(error);
    }
  }
  return next();
}

function createPlayerToken (req, res, next) {
  const token = jsonWebToken.sign({ playerId: req.body._id, userId: '' }, SECRET);
  res.send({ playerToken: token });
}

function setAttributes (req, tokenDecoded) {
  req.decoded = {};
  req.decoded.userId = tokenDecoded.userId;
  req.decoded.playerId = tokenDecoded.playerId;
}

function validateTokenRetrospective (req, res, next) {
  if (req.get('authorization')) {
    try {
      const token = req.get('authorization');
      const tokenDecoded = jsonWebToken.verify(token.split(' ')[1], SECRET);
      if (tokenDecoded.userId !== '' || tokenDecoded.playerId !== '') {
        setAttributes(req, tokenDecoded);
        verifyPlayer(req, res, next);
      }
    } catch (error) {
      error.title = 'Failed to authenticate token';
      error.status = 401;
      return next(error);
    }
  } else {
    const error = new Error('Missing token');
    error.title = 'Failed to authenticate token';
    error.status = 401;
    return next(error);
  }
}

async function verifyPlayer (req, res, next) {
  if (!req.body.retrospectiveId) {
    await getRetrospectiveIdFromItem(req, next);
  }
  if (req.decoded.userId !== '') {
    PlayerModel.findPlayerFromUser(req.decoded.userId, req.body.retrospectiveId)
      .then(playerFound => {
        if (playerFound) {
          req.decoded.playerId = playerFound._id;
          req.decoded.role = playerFound.role;
          return next();
        } else {
          const error = new Error('The user doesn\'t have a player registered in this retrospective');
          error.title = 'Player not found';
          error.status = 401;
          return next(error);
        }
      });
  } else {
    PlayerModel.getPlayer(req.decoded.playerId)
      .then(playerFound => {
        if (playerFound && playerFound.retrospectiveId.toString() === req.body.retrospectiveId) {
          req.decoded.role = playerFound.role;
          return next();
        } else {
          const error = new Error('The player doesn\'t exist in this retrospective');
          error.title = 'Player not found';
          error.status = 401;
          return next(error);
        }
      })
      .catch(error => {
        return next(error);
      });
  }
}

function getRetrospectiveIdFromItem (req, next) {
  return Item.findById(req.params.itemId)
    .then(itemFound => {
      req.body.retrospectiveId = itemFound.retrospectiveId.toString();
    })
    .catch(error => {
      next(error);
    });
}
function validateRole (req, res, next) {
  if ((req.body.children && req.body.children.length > 0) || req.body.actionItem || req.body.child || req.body.childId) {
    if (req.decoded.role === 'Moderator') {
      return next();
    } else {
      const error = new Error('Insufficient permission');
      error.title = 'the player does not have permission to perform this action';
      error.status = 401;
      return next(error);
    }
  }
  return next();
}

module.exports = {
  validateAuthorization,
  getUserAuthorization,
  createPlayerToken,
  validateTokenRetrospective,
  validateRole };
