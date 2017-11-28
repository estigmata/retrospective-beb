'use strict';

const mockery = require('mockery');
let ItemController;
class ItemModelMock {
  static saveItem () {}
  static updateItem () {}
  static deleteItemById () {}
  static getItems () {}
  static addChild () {}
  static updateItemVote () {}
  static removeChildFromGroup () {}
}

const res = {
  status () {
    return this;
  },
  send () {}
};

describe('Item Controller', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./item.model', ItemModelMock);
    ItemController = require('./item.controller');
  });

  describe('Edit an item', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });

    it('Should update the votes of an item', done => {
      spyOn(ItemModelMock, 'updateItem').and.returnValue(
        Promise.resolve({
          summary: 'test of a new item',
          categoryId: '59d513cf855bdd3626b224cc',
          retrospectiveId: '59d513cf855bdd3626b224cb',
          _id: '59d542492cf8f540c7862440',
          votes: 1,
          children: []
        })
      );

      ItemController.updateItemById({
        params: { retrospectiveId: '59d513cf855bdd3626b224cb', itemId: '59d542492cf8f540c7862440' },
        body: { votes: 1 }
      }, res).
        then(() => {
          expect(ItemModelMock.updateItem).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            summary: 'test of a new item',
            categoryId: '59d513cf855bdd3626b224cc',
            retrospectiveId: '59d513cf855bdd3626b224cb',
            _id: '59d542492cf8f540c7862440',
            votes: 1,
            children: []
          });
          done();
        });
    });

    it('Should get an error when updating an item', done => {
      const error = new Error('The item with that id was not found');
      error.title = 'Item not found';
      error.status = 404;
      spyOn(ItemModelMock, 'updateItem').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.updateItemById({
        params: { retrospectiveId: '59d513cf855bdd3626b224cb', itemId: '59d542492cf8f540c7862441' },
        body: { votes: 1 }
      }, res, next).
        then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });

  describe('Delete an item', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });

    it('Should retrieve the deleted item', done => {
      spyOn(ItemModelMock, 'deleteItemById').and.returnValue(
        Promise.resolve({
          _id: '59d250efe6ecd9292e350a0c',
          summary: 'test',
          categoryId: '59cd078e9ea150295094935a',
          retrospectiveId: '59cd078e9ea1502950949359',
          children: []
        })
      );

      ItemController.deleteItem({
        params: { retrospectiveId: '59d185b8b30893113cd0313a', itemId: '59d250efe6ecd9292e350a0c' }
      }, res).
        then(() => {
          expect(ItemModelMock.deleteItemById).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59d250efe6ecd9292e350a0c',
            summary: 'test',
            categoryId: '59cd078e9ea150295094935a',
            retrospectiveId: '59cd078e9ea1502950949359',
            children: []
          });
          done();
        });
    });

    it('Should throw an error because the identifier of the item doesn\'t exist', done => {
      const error = new Error('the identifier of the item or retrospective does not exist');
      error.title = 'could not delete item';
      error.status = 404;
      spyOn(ItemModelMock, 'deleteItemById').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.deleteItem({
        params: { retrospectiveId: '59d185b8b30893113cd0313a', itemId: '59d250efe6ecd9292e350bbc' }
      }, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });

  describe('Group items', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });

    it('Should return the item with a child', done => {
      spyOn(ItemModelMock, 'addChild').and.returnValue(
        Promise.resolve({
          _id: '59d250efe6ecd9292e350a0c',
          summary: 'test',
          categoryId: '59cd078e9ea150295094935a',
          retrospectiveId: '59cd078e9ea1502950949359',
          children: ['59cd078e9ea150295094a32c']
        })
      );
      ItemController.addChild({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: { child: '59cd078e9ea150295094a32c' }
      }, res).
        then(() => {
          expect(ItemModelMock.addChild).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59d250efe6ecd9292e350a0c',
            summary: 'test',
            categoryId: '59cd078e9ea150295094935a',
            retrospectiveId: '59cd078e9ea1502950949359',
            children: ['59cd078e9ea150295094a32c']
          });
          done();
        });
    });

    it('Should throw an error because the identifier of the item and the child ar the same', done => {
      const error = new Error('The item can not be a child of itself');
      error.title = 'Could not add child to the item';
      error.status = 400;
      spyOn(ItemModelMock, 'addChild').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.addChild({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: { child: '59d250efe6ecd9292e350a0c' }
      }, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });
  describe('Update vote in an item', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });

    it('Should retrieve the item with new vote', done => {
      spyOn(ItemModelMock, 'updateItemVote').and.returnValue(
        Promise.resolve({
          _id: '59df914b2c4edd30a320eb41',
          retrospectiveId: '59d3b3c972fe0713948f60cd',
          name: 'anonymous',
          maxVotes: 5,
          votes: [{
            itemId: '59d250efe6ecd9292e350a0c',
            numberVotes: 1
          }]
        })
      );

      ItemController.updateVotes({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: {
          playerId: '59df914b2c4edd30a320eb41',
          voteValue: 1
        }
      }, res).
        then(() => {
          expect(ItemModelMock.updateItemVote).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59df914b2c4edd30a320eb41',
            retrospectiveId: '59d3b3c972fe0713948f60cd',
            name: 'anonymous',
            maxVotes: 5,
            votes: [{
              itemId: '59d250efe6ecd9292e350a0c',
              numberVotes: 1
            }]
          });
          done();
        });
    });

    it('Should throw an error because the identifier of the item doesn\'t exist', done => {
      const error = new Error('the identifier of the item does not exist');
      error.title = 'Item not found';
      error.status = 404;
      spyOn(ItemModelMock, 'updateItemVote').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.updateVotes({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: {
          playerId: '59df914b2c4edd30a320eb41',
          voteValue: 1
        }
      }, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });

  describe('save an item', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });
    it('Should save a new Item', done => {
      spyOn(ItemModelMock, 'saveItem').and.returnValue(
        Promise.resolve({
          summary: 'test of a new item',
          categoryId: '59d185b8b30893113cd0313a',
          retrospectiveId: '59d185b8b30893113cd0313a',
          _id: '59d1930e9f31d0171440f032',
          children: []
        })
      );

      ItemController.saveItem({
        body: {
          summary: 'test of a new item',
          categoryId: '59d185b8b30893113cd0313a',
          retrospectiveId: '59d185b8b30893113cd0313a'
        },
        get: () => {}
      }, res, {})
        .then(() => {
          expect(ItemModelMock.saveItem).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            summary: 'test of a new item',
            categoryId: '59d185b8b30893113cd0313a',
            retrospectiveId: '59d185b8b30893113cd0313a',
            _id: '59d1930e9f31d0171440f032',
            children: []
          });
          done();
        });
    });

    it('Should throw an error because the retrospective doesn\'t exist', done => {
      const error = new Error('The retrospective with that id is not found');
      error.title = 'Retrospective not found';
      error.status = 404;
      const next = jasmine.createSpy('next');
      spyOn(ItemModelMock, 'saveItem').and.returnValue(
        Promise.reject(error)
      );
      ItemController.saveItem({
        params: { retrospectiveId: '59d185b8b30893113cd0313b' },
        body: {
          summary: 'test of a new item',
          categoryId: '59d185b8b30893113cd0313a'
        },
        get: () => {}
      }, res, next)
        .then(() => {
          expect(error.status).toEqual(404);
          done();
        });
    });
  });
  describe('ungroup items', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });

    it('should return the parent item without the element removed', done => {
      spyOn(ItemModelMock, 'removeChildFromGroup').and.returnValue(
        Promise.resolve({
          _id: '59d250efe6ecd9292e350a0c',
          summary: 'test',
          categoryId: '59cd078e9ea150295094935a',
          retrospectiveId: '59cd078e9ea1502950949359',
          children: ['59f207c270f1502186756488', '59f207c970f1502186756489']
        })
      );
      ItemController.removeItemByGroup({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: { child: '59cd078e9ea150295094a32c' }
      }, res).
        then(() => {
          expect(ItemModelMock.removeChildFromGroup).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59d250efe6ecd9292e350a0c',
            summary: 'test',
            categoryId: '59cd078e9ea150295094935a',
            retrospectiveId: '59cd078e9ea1502950949359',
            children: ['59f207c270f1502186756488', '59f207c970f1502186756489']
          });
          done();
        });
    });

    it('should return the deleted parent item under the rule if deleting one of the children of the parent' +
      'element will have only one child after that operation.', done => {
      spyOn(ItemModelMock, 'removeChildFromGroup').and.returnValue(
        Promise.resolve({
          _id: '59f207c270f1502186756488',
          summary: 'test',
          categoryId: '59cd078e9ea150295094935a',
          retrospectiveId: '59cd078e9ea1502950949359',
          children: []
        })
      );
      ItemController.removeItemByGroup({
        params: { itemId: '59f207c270f1502186756488' },
        body: { child: '59cd078e9ea150295094a32c' }
      }, res).
        then(() => {
          expect(ItemModelMock.removeChildFromGroup).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59f207c270f1502186756488',
            summary: 'test',
            categoryId: '59cd078e9ea150295094935a',
            retrospectiveId: '59cd078e9ea1502950949359',
            children: []
          });
          done();
        });
    });

    it('Should throw an error because the item parent doesn\'t exist', done => {
      const error = new Error('The item parent do not exists');
      error.title = 'Could not ungroup';
      error.status = 404;
      spyOn(ItemModelMock, 'removeChildFromGroup').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.removeItemByGroup({
        params: { itemId: '59d250efe6ecd9292e350a0d' },
        body: { child: '59f207c270f1502186756488' }
      }, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });

    it('Should throw an error because the item child doesn\'t exist', done => {
      const error = new Error('The item child do not exists');
      error.title = 'Could not ungroup';
      error.status = 404;
      spyOn(ItemModelMock, 'removeChildFromGroup').and.returnValue(
        Promise.reject(error)
      );
      const next = jasmine.createSpy('next');
      ItemController.removeItemByGroup({
        params: { itemId: '59d250efe6ecd9292e350a0c' },
        body: { child: '59f207c270f1502186756484' }
      }, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });
});
