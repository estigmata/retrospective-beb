'use strict';

const Item = require('./item');
const PlayerModel = require('./../players/player.model');
const Player = require('./../players/player');
const Retrospective = require('./../retrospectives/retrospective');

class ItemModel {

  static saveItem (newItem) {
    return Promise.all([
      Retrospective.findById(newItem.retrospectiveId),
      Player.findById(newItem.playerId)
    ]).then(([retrospectiveFound, playerFound]) => {
      if (!retrospectiveFound) {
        const error = new Error('The retrospective with that id is not found');
        error.title = 'Retrospective not found';
        error.status = 404;
        throw error;
      }
      if (!playerFound || !playerFound.retrospectiveId.equals(retrospectiveFound._id)) {
        const error = new Error('The user with that id is not found');
        error.title = 'User not found';
        error.status = 404;
        throw error;
      }
      const item = new Item(newItem);
      if (item.children && item.children.length > 0) {
        this.findDuplicated(item.children.slice());
        item.children.forEach(childId => {
          this.updateItem(childId, { parent: false });
        });
      }
      return item.save();
    });
  }

  static findDuplicated (itemList) {
    let itemId;
    let isDuplicated = false;
    while (itemList.length > 0) {
      itemId = itemList.shift();
      isDuplicated = itemList.some(currentItemId => {
        return itemId.equals(currentItemId);
      });
      if (isDuplicated) {
        const error = new Error('The item cannot have duplicated children');
        error.title = 'Could not create the item';
        error.status = 404;
        throw error;
      }
    }
  }

  static updateItem (itemId, field) {
    return Item.findOneAndUpdate({ _id: itemId }, { $set: field }, { new: true })
      .then(updatedItem => {
        if (!updatedItem) {
          const error = new Error('The item with that id was not found');
          error.title = 'Item not found';
          error.status = 404;
          throw error;
        }
        return updatedItem;
      });
  }

  static deleteItemById (itemId) {
    return Item.findOneAndRemove({ _id: itemId })
      .then(deletedItem => {
        if (!deletedItem) {
          const error = new Error('The identifier of the item does not exist');
          error.title = 'Could not delete item';
          error.status = 404;
          throw error;
        }
        return deletedItem;
      });
  }

  static updateItemVote (itemId, playerId, voteValue) {
    return PlayerModel.validatePlayerVote(itemId, playerId, voteValue)
      .then(() => {
        return Item.findById(itemId);
      })
      .then(itemFound => {
        if (!itemFound) {
          const error = new Error('The item with that id is not found');
          error.title = 'Item not found';
          error.status = 404;
          throw error;
        }
        return itemFound.updateVotes(voteValue);
      })
      .then(item => {
        return PlayerModel.updatePlayerVotes(item._id, playerId, voteValue);
      }).
      catch(err => {
        const error = new Error(err);
        error.title = err.title;
        error.status = err.status;
        throw error;
      });
  }
  static addChild (itemId, childId) {
    if (itemId === childId) {
      const error = new Error('The item cannot be a child of itself');
      error.title = 'Could not add child to the item';
      error.status = 400;
      return Promise.reject(error);
    }

    return Item.findById(childId)
      .then(childFound => {
        if (!childFound) {
          const error = new Error('The child item does not exist');
          error.title = 'Could not found the item child';
          error.status = 404;
          throw error;
        }
        if (childFound.parent === false) {
          const error = new Error('The item sent is already grouped in another item');
          error.title = 'Could not group the items';
          error.status = 400;
          throw error;
        }

        return Promise.all([
          this.updateItem(childId, { parent: false }),
          Item.findByIdAndUpdate(itemId, { $push: { children: childId } }, { new: true })
        ]);
      })
      .then(([childItem, updatedItem]) => {
        if (!updatedItem) {
          const error = new Error('The identifier of the item does not exist');
          error.title = 'Could not update item';
          error.status = 404;
          throw error;
        }

        return updatedItem;
      });
  }

  static removeChildFromGroup (itemParentId, childId) {
    const promises = [];
    promises.push(Item.findByIdAndUpdate(itemParentId, { $pull: { children: childId } }, { new: true }));
    promises.push(Item.findByIdAndUpdate(childId, { $set: { parent: true } }, { new: true }));
    return Promise.all(promises)
      .then(([parentItem, childItem ]) => {
        if (!parentItem) {
          const error = new Error('The item parent do not exists');
          error.title = 'Could not ungroup';
          error.status = 404;
          throw error;
        }

        if (!childItem) {
          const error = new Error('The item child do not exists');
          error.title = 'Could not ungroup';
          error.status = 404;
          throw error;
        }

        if (parentItem.children.length === 1) {
          return ItemModel.removeChildFromGroup(itemParentId, parentItem.children[0]);
        } else if (parentItem.children.length === 0) {
          return ItemModel.deleteItemById(itemParentId);
        }
        return parentItem;
      });
  }
}

module.exports = ItemModel;
