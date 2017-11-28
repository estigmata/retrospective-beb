'use strict';

const mockery = require('mockery');

let PlayerController;

class PlayerModelMock {
  static createAnonymousPlayer () {}
  static getPlayer () {}
}

const res = {
  status () {
    return this;
  },
  send () {}
};

describe('Player Controller', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./player.model', PlayerModelMock);
    PlayerController = require('./player.controller');
  });

  describe('Get player', () => {
    beforeEach(() => {
      spyOn(res, 'status').and.callThrough();
      spyOn(res, 'send');
    });
    it('Should retrieve the player if it is found', done => {
      spyOn(PlayerModelMock, 'getPlayer').and.returnValue(
        Promise.resolve([
          {
            _id: '59d3bca89dddb9224c0da067',
            name: 'anonymus',
            retrospectiveId: '59d3bc2872fe0713948f60d1',
            votes: []
          }
        ])
      );
      PlayerController.getPlayer({
        params: { playerId: '59d3bc2872fe0713948f60d1' }
      }, res)
        .then(() => {
          expect(PlayerModelMock.getPlayer).toHaveBeenCalledWith('59d3bc2872fe0713948f60d1');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith([
            {
              _id: '59d3bca89dddb9224c0da067',
              name: 'anonymus',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              votes: []
            }
          ]);
          done();
        });
    });

    it('Should return an error if the player does not exist', done => {
      const error = new Error('The player with that id is not found');
      error.title = 'Player not found';
      error.status = 404;
      spyOn(PlayerModelMock, 'getPlayer').and.returnValue(
        Promise.reject(error)
      );
      PlayerController.getPlayer({
        params: { playerId: '59cd078e9ea15029509493aa' }
      }, res)
        .then()
        .catch(() => {
          expect(PlayerModelMock.getPlayer).toHaveBeenCalledWith('59cd078e9ea15029509493aa');
          expect(error.status).toEqual(404);
          done();
        });
    });
  });
});
