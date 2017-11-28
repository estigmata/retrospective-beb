'use strict';

const ItemModel = require('./item.model');

class ItemController {

  static saveItem (req, res, next) {
    req.body.playerId = req.decoded.playerId;
    return ItemModel.saveItem(req.body)
      .then(savedItem => {
        res.status(200)
          .send(savedItem);
      })
      .catch(error => {
        next(error);
      });
  }

  static updateItemById (req, res, next) {
    return ItemModel.updateItem(req.params.itemId, req.body)
      .then(updateItem => res.status(200).send(updateItem))
      .catch(error => {
        next(error);
      });
  }

  static deleteItem (req, res, next) {
    return ItemModel.deleteItemById(req.params.itemId)
      .then(deletedItem => {
        res.status(200).send(deletedItem);
      }).catch(error => {
        next(error);
      });
  }
  static addChild (req, res, next) {
    return ItemModel.addChild(req.params.itemId, req.body.child)
      .then(updatedItem => {
        res.status(200).send(updatedItem);
      }).catch(error => {
        next(error);
      });
  }

  static updateVotes (req, res, next) {
    return ItemModel.updateItemVote(req.params.itemId, req.body.playerId, req.body.voteValue)
      .then(updateItem => {
        res.status(200)
          .send(updateItem);
      })
      .catch(error => {
        next(error);
      });
  }

  static removeItemByGroup (req, res, next) {
    return ItemModel.removeChildFromGroup(req.params.itemId, req.body.childId)
      .then(updateItem => {
        res.status(200).send(updateItem);
      })
      .catch(error => {
        next(error);
      });
  }
}

module.exports = ItemController;
