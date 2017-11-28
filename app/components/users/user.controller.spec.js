'use strict';

const mockery = require('mockery');
let UserController;
class UserModelMock {
  static getPlayerFromRetrospective () {}
}

const res = {
  status () {
    return this;
  },
  send () {}
};

describe('User Controller', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    spyOn(res, 'status').and.callThrough();
    mockery.registerMock('./user.model', UserModelMock);
    UserController = require('./user.controller');
  });

  describe('Get a user\'s player from a retrospective', () => {

    it('Should retrieve the player found', done => {
      spyOn(UserModelMock, 'getPlayerFromRetrospective').and.returnValue(
        Promise.resolve({
          _id: '5a04692425d95e9db8608292',
          name: 'pepe',
          role: 'Participant',
          votes: ''
        })
      );
      spyOn(res, 'send');
      UserController.getPlayerFromRetrospective({
        params: {
          retrospectiveId: '59cd078e9ea1502950949359',
          userId: '5a04692425d95e9db8608292'
        }
      }, res).
        then(() => {
          expect(UserModelMock.getPlayerFromRetrospective)
            .toHaveBeenCalledWith('5a04692425d95e9db8608292', '59cd078e9ea1502950949359');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith({
            _id: '5a04692425d95e9db8608292',
            name: 'pepe',
            role: 'Participant',
            votes: ''
          });
          done();
        });
    });
  });
});

