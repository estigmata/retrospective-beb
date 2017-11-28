'use strict';

const mockery = require('mockery');
let RetrospectiveController;
class RetrospectiveModelMock {
  static getRetrospectiveById () {}
  static createRetrospective () {}
  static saveItem () {}
  static getItems () {}
  static getRetrospectives () {}
  static updateRetrospective () {}
  static getPlayers () {}
}

class PlayerModelMock {
  static createPlayer () {}
}

const res = {
  status () {
    return this;
  },
  send () {}
};
let next = '';
describe('Retrospective Controller', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    spyOn(res, 'status').and.callThrough();
    next = jasmine.createSpy('next');
    mockery.registerMock('./retrospective.model', RetrospectiveModelMock);
    mockery.registerMock('./../players/player.model', PlayerModelMock);
    RetrospectiveController = require('./retrospective.controller');
  });

  describe('Get a retrospective by id', () => {

    it('Should retrieve the retrospective found', done => {
      spyOn(RetrospectiveModelMock, 'getRetrospectiveById').and.returnValue(
        Promise.resolve({
          _id: '59cd078e9ea1502950949359',
          name: 'retrospective iteration 1',
          categories: [
            {
              name: 'what went well'
            }
          ]
        })
      );
      spyOn(res, 'send');
      RetrospectiveController.getRetrospective({
        params: { retrospectiveId: '59cd078e9ea1502950949359' }
      }, res).
        then(() => {
          expect(RetrospectiveModelMock.getRetrospectiveById).toHaveBeenCalledWith('59cd078e9ea1502950949359');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '59cd078e9ea1502950949359',
            name: 'retrospective iteration 1',
            categories: [
              {
                name: 'what went well'
              }
            ]
          });
          done();
        });
    });
    it('Should return an error with a non existence retrospective', done => {
      const error = new Error('The retrospective with that id is not found');
      error.title = 'Retrospective not found';
      error.status = 404;
      spyOn(RetrospectiveModelMock, 'getRetrospectiveById').and.returnValue(
        Promise.reject(error)
      );
      RetrospectiveController.getRetrospective({
        params: { retrospectiveId: '59cd078e9ea15029509493aa' }
      }, res).
        then()
        .catch(() => {
          expect(RetrospectiveModelMock.getRetrospectiveById).toHaveBeenCalledWith('59cd078e9ea15029509493aa');
          expect(error.status).toEqual(404);
          done();
        });
    });
  });
  describe('Create a new retrospective', () => {

    it('Should retrieve a new retrospective', done => {
      spyOn(RetrospectiveModelMock, 'createRetrospective').and.returnValue(
        Promise.resolve({
          name: 'retrospective 1',
          _id: '59d3e0a8327cbc138e4851b3',
          categories: [
            {
              name: 'what went well',
              _id: '59d3e0a8327cbc138e4851b1'
            },
            {
              name: 'what didn\'t go well',
              _id: '59d3e0a8327cbc138e4851b2'
            }
          ]
        })
      );
      spyOn(res, 'send');

      const newRetrospective = {
        name: 'retrospective 1',
        categories: [
          { name: 'what went well' },
          { name: 'what didn\'t go well' }
        ]
      };

      RetrospectiveController.createNewRetrospective({
        body: newRetrospective,
        decoded: { userId: '5a04692425d95e9db8608292' } }, res)
        .then(() => {
          expect(RetrospectiveModelMock.createRetrospective).toHaveBeenCalledWith('5a04692425d95e9db8608292', newRetrospective);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            name: 'retrospective 1',
            _id: '59d3e0a8327cbc138e4851b3',
            categories: [
              {
                name: 'what went well',
                _id: '59d3e0a8327cbc138e4851b1'
              },
              {
                name: 'what didn\'t go well',
                _id: '59d3e0a8327cbc138e4851b2'
              }
            ]
          });
          done();
        });
    });
    it('Should return an error', done => {
      const error = new Error();
      spyOn(RetrospectiveModelMock, 'createRetrospective').and.returnValue(
        Promise.reject(error)
      );

      const newRetrospective = {
        name: 'retrospective 1',
        categories: [
          { name: 'what went well' },
          { name: 'what didn\'t go well' }
        ]
      };

      RetrospectiveController.createNewRetrospective({
        body: newRetrospective,
        decoded: { userId: '5a04692425d95e9db8608292' } }, res, next)
        .then(() => {
          expect(RetrospectiveModelMock.createRetrospective).toHaveBeenCalledWith('5a04692425d95e9db8608292', newRetrospective);
          expect(error.status).toBe(400);
          expect(error.title).toBe('The retrospective could not be created');
          done();
        });
    });
  });

  describe('Get items by retrospective', () => {
    it('Should retrieve the items if the retrospective found', done => {
      spyOn(RetrospectiveModelMock, 'getItems').and.returnValue(
        Promise.resolve([
          {
            _id: '59d3bca89dddb9224c0da067',
            summary: 'Code',
            categoryId: '59d3b45572fe0713948f60cf',
            retrospectiveId: '59d3bc2872fe0713948f60d1',
            children: []
          },
          {
            _id: '59d3bcb39dddb9224c0da068',
            summary: 'standard styles',
            categoryId: '59d3b45572fe0713948f60cf',
            retrospectiveId: '59d3bc2872fe0713948f60d1',
            children: []
          }
        ])
      );
      spyOn(res, 'send');
      RetrospectiveController.getItems({
        params: { retrospectiveId: '59d3bc2872fe0713948f60d1' }
      }, res)
        .then(() => {
          expect(RetrospectiveModelMock.getItems).toHaveBeenCalledWith('59d3bc2872fe0713948f60d1');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith([
            {
              _id: '59d3bca89dddb9224c0da067',
              summary: 'Code',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              children: []
            },
            {
              _id: '59d3bcb39dddb9224c0da068',
              summary: 'standard styles',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              children: []
            }
          ]);
          done();
        });
    });
    it('Should return an error with a non existence retrospective', done => {
      const error = new Error('The retrospective with that id is not found');
      error.title = 'Retrospective not found';
      error.status = 404;
      spyOn(RetrospectiveModelMock, 'getItems').and.returnValue(
        Promise.reject(error)
      );
      RetrospectiveController.getItems({
        params: { retrospectiveId: '59cd078e9ea15029509493aa' }
      }, res)
        .then()
        .catch(() => {
          expect(RetrospectiveModelMock.getItems).toHaveBeenCalledWith('59cd078e9ea15029509493aa');
          expect(error.status).toEqual(404);
          done();
        });
    });
  });

  describe('create a player anonymus in retrospective', () => {
    beforeEach(() => {
      spyOn(res, 'send');
    });
    it('Should create an anonymus player and return it', done => {
      spyOn(PlayerModelMock, 'createPlayer').and.returnValue(
        Promise.resolve({
          name: 'anonymus',
          retrospectiveId: '59d185b8b30893113cd0313a',
          votes: [],
          maxVotes: 5
        })
      );
      RetrospectiveController.createAnonymousPlayer({
        params: { retrospectiveId: '59d185b8b30893113cd0313a' },
        body: {
          name: 'anonymus'
        }
      }, res)
        .then(() => {
          expect(PlayerModelMock.createPlayer).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            name: 'anonymus',
            retrospectiveId: '59d185b8b30893113cd0313a',
            votes: [],
            maxVotes: 5
          });
          done();
        });
    });

    it('Should throw an error because the retrospective doesn\'t exist', done => {
      const error = new Error('The retrospective with that id is not found');
      error.title = 'Retrospective not found';
      error.status = 404;
      spyOn(PlayerModelMock, 'createPlayer').and.returnValue(
        Promise.reject(error)
      );
      RetrospectiveController.createAnonymousPlayer({
        params: { retrospectiveId: '59d185b8b30893113cd0313b' },
        body: {
        }
      }, res, next)
        .then(() => {
          expect(error.status).toEqual(404);
          done();
        });
    });
  });

  describe('create a player with name', () => {
    beforeEach(() => {
      spyOn(res, 'send');
    });
    it('Should create a named player return it', done => {
      spyOn(PlayerModelMock, 'createPlayer').and.returnValue(
        Promise.resolve({
          name: 'luis',
          retrospectiveId: '59d185b8b30893113cd0313a',
          votes: [],
          maxVotes: 5
        })
      );
      RetrospectiveController.createAnonymousPlayer({
        params: { retrospectiveId: '59d185b8b30893113cd0313a' },
        body: {
          name: 'luis'
        }
      }, res)
        .then(() => {
          expect(PlayerModelMock.createPlayer).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            name: 'luis',
            retrospectiveId: '59d185b8b30893113cd0313a',
            votes: [],
            maxVotes: 5
          });
          done();
        });
    });

    it('Should throw an error because the retrospective doesn\'t exist', done => {
      const error = new Error('The retrospective with that id is not found');
      error.title = 'Retrospective not found';
      error.status = 404;
      spyOn(PlayerModelMock, 'createPlayer').and.returnValue(
        Promise.reject(error)
      );
      RetrospectiveController.createAnonymousPlayer({
        params: { retrospectiveId: '59d185b8b30893113cd0313b' },
        body: {
        }
      }, res, next)
        .then(() => {
          expect(error.status).toEqual(404);
          done();
        });
    });
  });

  describe('Get retrospectives', () => {
    beforeEach(() => {
      spyOn(res, 'send');
    });
    it('Should retrieve the retrospectives found', done => {
      spyOn(RetrospectiveModelMock, 'getRetrospectives').and.returnValue(
        Promise.resolve([
          {
            _id: '59e8c5139f4a755923cc4235',
            name: 'retro3',
            createDate: '2017-10-19T15:30:27.374Z',
            maxVotes: 5,
            categories: [
              {
                name: 'what went well',
                _id: '59e8c5139f4a755923cc4237'
              },
              {
                name: 'what did not go well',
                _id: '59e8c5139f4a755923cc4236'
              }
            ]
          },
          {
            _id: '59e8c50c9f4a755923cc4232',
            name: 'retro2',
            createDate: '2017-10-19T15:30:20.573Z',
            maxVotes: 5,
            categories: [
              {
                name: 'what went well',
                _id: '59e8c50c9f4a755923cc4234'
              },
              {
                name: 'what did not go well',
                _id: '59e8c50c9f4a755923cc4233'
              }
            ]
          }
        ])
      );
      RetrospectiveController.getRetrospectives({}, res)
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith([
            {
              _id: '59e8c5139f4a755923cc4235',
              name: 'retro3',
              createDate: '2017-10-19T15:30:27.374Z',
              maxVotes: 5,
              categories: [
                {
                  name: 'what went well',
                  _id: '59e8c5139f4a755923cc4237'
                },
                {
                  name: 'what did not go well',
                  _id: '59e8c5139f4a755923cc4236'
                }
              ]
            },
            {
              _id: '59e8c50c9f4a755923cc4232',
              name: 'retro2',
              createDate: '2017-10-19T15:30:20.573Z',
              maxVotes: 5,
              categories: [
                {
                  name: 'what went well',
                  _id: '59e8c50c9f4a755923cc4234'
                },
                {
                  name: 'what did not go well',
                  _id: '59e8c50c9f4a755923cc4233'
                }
              ]
            }
          ]);
          done();
        });
    });
  });

  describe('Get all players from a retrospective', () => {
    beforeEach(() => {
      spyOn(res, 'send');
    });
    const req = { params: { retrospectiveId: '59f3840cefbbb0478211f213' } };
    it('Should return all players found from a retrospective', done => {
      spyOn(RetrospectiveModelMock, 'getPlayers').and.returnValue(
        Promise.resolve([
          {
            _id: '59f3840eefbbb0478211f216',
            retrospectiveId: '59f3840cefbbb0478211f213',
            maxVotes: 5,
            votes: [
              {
                itemId: '59f3842529e71147dd600335',
                numberVotes: 2
              },
              {
                itemId: '59f3842e29e71147dd600338',
                numberVotes: 3
              }
            ],
            name: 'Anonymus'
          },
          {
            _id: '59f393c1f64ce451c1d7161f',
            retrospectiveId: '59f3840cefbbb0478211f213',
            maxVotes: 5,
            votes: [],
            name: 'Anonymus'
          }
        ])
      );

      RetrospectiveController.getPlayers(req, res)
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith([
            {
              _id: '59f3840eefbbb0478211f216',
              retrospectiveId: '59f3840cefbbb0478211f213',
              maxVotes: 5,
              votes: [
                {
                  itemId: '59f3842529e71147dd600335',
                  numberVotes: 2
                },
                {
                  itemId: '59f3842e29e71147dd600338',
                  numberVotes: 3
                }
              ],
              name: 'Anonymus'
            },
            {
              _id: '59f393c1f64ce451c1d7161f',
              retrospectiveId: '59f3840cefbbb0478211f213',
              maxVotes: 5,
              votes: [],
              name: 'Anonymus'
            }
          ]);
          done();
        });
    });
    it('Should return a error from the database', done => {
      const error = new Error('E11000 error collection: main_db.stores index...');
      spyOn(RetrospectiveModelMock, 'getPlayers').and.returnValue(
        Promise.reject(error)
      );

      RetrospectiveController.getPlayers(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });

  describe('Get all players from a retrospective', () => {
    beforeEach(() => {
      spyOn(res, 'send');
    });
    const req = { params: { retrospectiveId: '59f3840cefbbb0478211f213' } };
    it('Should return all players found from a retrospective', done => {
      spyOn(RetrospectiveModelMock, 'getPlayers').and.returnValue(
        Promise.resolve([
          {
            _id: '59f3840eefbbb0478211f216',
            retrospectiveId: '59f3840cefbbb0478211f213',
            maxVotes: 5,
            votes: [
              {
                itemId: '59f3842529e71147dd600335',
                numberVotes: 2
              },
              {
                itemId: '59f3842e29e71147dd600338',
                numberVotes: 3
              }
            ],
            name: 'Anonymus'
          },
          {
            _id: '59f393c1f64ce451c1d7161f',
            retrospectiveId: '59f3840cefbbb0478211f213',
            maxVotes: 5,
            votes: [],
            name: 'Anonymus'
          }
        ])
      );

      RetrospectiveController.getPlayers(req, res)
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith([
            {
              _id: '59f3840eefbbb0478211f216',
              retrospectiveId: '59f3840cefbbb0478211f213',
              maxVotes: 5,
              votes: [
                {
                  itemId: '59f3842529e71147dd600335',
                  numberVotes: 2
                },
                {
                  itemId: '59f3842e29e71147dd600338',
                  numberVotes: 3
                }
              ],
              name: 'Anonymus'
            },
            {
              _id: '59f393c1f64ce451c1d7161f',
              retrospectiveId: '59f3840cefbbb0478211f213',
              maxVotes: 5,
              votes: [],
              name: 'Anonymus'
            }
          ]);
          done();
        });
    });
    it('Should return a error from the database', done => {
      const error = new Error('E11000 error collection: main_db.stores index...');
      spyOn(RetrospectiveModelMock, 'getPlayers').and.returnValue(
        Promise.reject(error)
      );

      RetrospectiveController.getPlayers(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(error);
          done();
        });
    });
  });

});
