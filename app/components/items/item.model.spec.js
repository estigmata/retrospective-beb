'use strict';

const mockery = require('mockery');

class ItemDBMock {

  constructor (item) {
    this.item = item;
    this.children = item.children;
  }
  save () {
    return Promise.resolve(this.item);
  }
  static findById () {}
  static findOne () {}
  static findByIdAndUpdate () {}
  updateVotes () {
    this.item.votes = 2;
    return Promise.resolve(this.item);
  }

}

class RetrospectiveDBMock {
  static findById () {}
  static find () {}
  static sort () {}
}

class PlayerModelMock {
  static validatePlayerVote () {}
  static updatePlayerVotes () {}
}

class PlayerDBMock {
  static findById () {}
}

let ItemModel;

describe('Item model', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./../players/player.model', PlayerModelMock);
    mockery.registerMock('./item', ItemDBMock);
    mockery.registerMock('./../retrospectives/retrospective', RetrospectiveDBMock);
    mockery.registerMock('./../players/player', PlayerDBMock);
    ItemModel = require('./item.model');
  });

  describe('Update vote in an Item', () => {

    it('should retrieve the item with new vote', done => {
      spyOn(ItemDBMock, 'findById').and.returnValue(
        Promise.resolve(
          new ItemDBMock({
            _id: '59d3b6c9526eb615ef1f046c',
            summary: 'Code frezzing',
            categoryId: '59d3b41d72fe0713948f60ce',
            retrospectiveId: '59d3b3c972fe0713948f60cd',
            votes: 1,
            children: []
          })
        ));
      spyOn(PlayerModelMock, 'validatePlayerVote').and.returnValue(
        Promise.resolve(true));
      spyOn(PlayerModelMock, 'updatePlayerVotes').and.returnValue(
        Promise.resolve(
          {
            _id: '59df914b2c4edd30a320eb41',
            retrospectiveId: '59d3b3c972fe0713948f60cd',
            name: 'anonymous',
            maxVotes: 5,
            votes: [
              {
                itemId: '59d3b6c9526eb615ef1f046c',
                numberVotes: 2
              }
            ]
          }
        ));
      ItemModel.updateItemVote('59d3b6c9526eb615ef1f046c', '59df914b2c4edd30a320eb41', 1)
        .then(voteUpdate => {
          expect(ItemDBMock.findById).toHaveBeenCalledWith('59d3b6c9526eb615ef1f046c');
          const rigthAnswer =  {
            _id: '59df914b2c4edd30a320eb41',
            retrospectiveId: '59d3b3c972fe0713948f60cd',
            name: 'anonymous',
            maxVotes: 5,
            votes: [
              {
                itemId: '59d3b6c9526eb615ef1f046c',
                numberVotes: 2
              }
            ]
          };
          expect(voteUpdate).toEqual(rigthAnswer);
          done();
        });
    });

    it('should return an error when the item was not found', done => {
      const err = new Error('The item with that id is not found');
      err.title = 'Item not found';
      spyOn(ItemDBMock, 'findById').and.returnValue(
        Promise.reject(err)
      );
      spyOn(PlayerModelMock, 'validatePlayerVote').and.returnValue(
        Promise.resolve(true));
      ItemModel.updateItemVote('59d3b6c9526eb615ef1f046c', '59df914b2c4edd30a320eb41', 1)
        .then(() => {})
        .catch(error => {
          expect(ItemDBMock.findById).toHaveBeenCalledWith('59d3b6c9526eb615ef1f046c');
          expect(error.message).toEqual('Error: The item with that id is not found');
          expect(error.title).toEqual('Item not found');
          done();
        });
    });
  });
  describe('Push a child in an item', () => {

    it('Should retrieve the item with a child', done => {
      spyOn(ItemDBMock, 'findById').and.returnValue(Promise.resolve({ parent: true }));
      spyOn(ItemModel, 'updateItem').and.returnValue(Promise.resolve({}));
      spyOn(ItemDBMock, 'findByIdAndUpdate').and.returnValue(
        Promise.resolve(
          { _id: '59d7fea6948db42c11d69c6c',
            summary: 'asdad',
            retrospectiveId: '59d7fbec948db42c11d69c66',
            categoryId: '59d7fbec948db42c11d69c68',
            votes: 0,
            parent: true,
            children: ['59d7fea6948db42c11d69c6e']
          }
        ));
      ItemModel.addChild('59d7fea6948db42c11d69c6c', '59d7fea6948db42c11d69c6e').then(itemUpdated => {
        expect(itemUpdated).toEqual(
          {
            _id: '59d7fea6948db42c11d69c6c',
            summary: 'asdad',
            retrospectiveId: '59d7fbec948db42c11d69c66',
            categoryId: '59d7fbec948db42c11d69c68',
            votes: 0,
            parent: true,
            children: ['59d7fea6948db42c11d69c6e']
          });
        done();
      });
    });

    it('Should return an error because the itemID and the child are the same', done => {
      ItemModel.addChild('59d7fea6948db42c11d69c6c', '59d7fea6948db42c11d69c6c')
        .then()
        .catch(error => {
          expect(error.message).toBe('The item cannot be a child of itself');
          expect(error.title).toBe('Could not add child to the item');
          expect(error.status).toBe(400);
          done();
        });
    });
  });

  describe('save an Item', () => {
    it('should return the saved item without chidren', done => {
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.resolve({ _id: '59f0c007922ec62315bdc28d' })
      );
      spyOn(PlayerDBMock, 'findById').and.returnValue(
        Promise.resolve({ retrospectiveId: { equals: () => { return true; } } })
      );
      const newItem = {
        playerId: '5a006b3cbf76f70f8fcf010e',
        categoryId: '59e93426fa1ed4690d4e0451',
        retrospectiveId: '59f0c007922ec62315bdc28d',
        summary: 'test item',
        children: []
      };
      ItemModel.saveItem(newItem).then(savedItem => {
        expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59f0c007922ec62315bdc28d');
        expect(savedItem.summary).toBe(newItem.summary);
        expect(savedItem.retrospectiveId).toBe(newItem.retrospectiveId);
        expect(savedItem.categoryId).toBe(newItem.categoryId);
        done();
      });
    });
    it('should return the saved item with chidren', done => {
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.resolve({ _id: '59f0c007922ec62315bdc28d' })
      );
      spyOn(PlayerDBMock, 'findById').and.returnValue(
        Promise.resolve({ retrospectiveId: { equals: () => { return true; } } })
      );
      spyOn(ItemModel, 'findDuplicated').and.returnValue(false);
      spyOn(ItemModel, 'updateItem');
      const newItem = {
        playerId: '5a006b3cbf76f70f8fcf010e',
        categoryId: '59e93426fa1ed4690d4e0451',
        retrospectiveId: '59f0c007922ec62315bdc28d',
        summary: 'test item',
        children: ['59f0c16fc3180727496a097c', '59f0c16fc3180727496a097d']
      };
      ItemModel.saveItem(newItem).then(savedItem => {
        expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59f0c007922ec62315bdc28d');
        expect(ItemModel.findDuplicated).toHaveBeenCalledWith(newItem.children);
        expect(savedItem.summary).toBe(newItem.summary);
        expect(savedItem.retrospectiveId).toBe(newItem.retrospectiveId);
        expect(savedItem.categoryId).toBe(newItem.categoryId);
        expect(savedItem.children).toBe(newItem.children);
        done();
      });
    });

    it('should throw and exception because the retrospective doesn\'t exist ', done => {
      const newItem = {
        playerId: '5a006b3cbf76f70f8fcf010e',
        summary: 'test item',
        categoryId: '59cd078e9ea150295094935a',
        retrospectiveId: '59f0c007922ec62315bdc28d'
      };
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.resolve()
      );
      spyOn(PlayerDBMock, 'findById').and.returnValue(
        Promise.resolve({ retrospectiveId: { equals: () => { return true; } } })
      );
      ItemModel.saveItem(newItem)
        .catch(error => {
          expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith(newItem.retrospectiveId);
          expect(error.message).toEqual('The retrospective with that id is not found');
          expect(error.title).toEqual('Retrospective not found');
          expect(error.status).toBe(404);
          done();
        });
    });
  });

  it('should throw and exception because the item has douplicated children ', done => {
    const newItem = {
      summary: 'test item',
      categoryId: '59cd078e9ea150295094935a',
      retrospectiveId: '59f0c007922ec62315bdc28d',
      children: ['59f0c16fc3180727496a097c', '59f0c16fc3180727496a097c']
    };
    const error = new Error('The item cannot have duplicated children');
    error.title = 'Could not create the item';
    error.status = 404;
    spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
      Promise.resolve({})
    );
    spyOn(PlayerDBMock, 'findById').and.returnValue(
      Promise.resolve({ retrospectiveId: { equals: () => { return true; } } })
    );
    spyOn(ItemModel, 'findDuplicated').and.throwError(error);
    ItemModel.saveItem(newItem)
      .catch(err => {
        expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith(newItem.retrospectiveId);
        expect(PlayerDBMock.findById).toHaveBeenCalledWith(newItem.playerId);
        expect(error.message).toBe(err.message);
        expect(error.title).toBe(err.title);
        expect(error.status).toBe(err.status);
        done();
      });
  });
});
