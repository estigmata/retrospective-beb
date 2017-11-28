'use strict';

const mockery = require('mockery');

class RetrospectiveDBMock {
  static findById () {}
  static find () {}
  static sort () {}
  static findOneAndUpdate () {}
}
class ItemDBMock {

  constructor (item) {
    this.item = item;
  }
  static find () { }
  static populate () { }
}

let RetrospectiveModel;

describe('Retrospective model', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./retrospective', RetrospectiveDBMock);
    mockery.registerMock('./../items/item', ItemDBMock);
    RetrospectiveModel = require('./retrospective.model');
  });

  describe('Get a retrospective by id', () => {

    it('should retrieve the retrospective that matches the id', done => {
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.resolve(
          {
            _id: '59cd078e9ea1502950949359',
            name: 'retrospective iteration 1',
            categories: [
              {
                name: 'what went well'
              }
            ]
          }
        ));
      RetrospectiveModel.getRetrospectiveById('59cd078e9ea1502950949359').then(retrospectiveFound => {
        expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59cd078e9ea1502950949359');
        const rigthAnswer =  {
          _id: '59cd078e9ea1502950949359',
          name: 'retrospective iteration 1',
          categories: [
            {
              name: 'what went well'
            }
          ]
        };
        expect(retrospectiveFound).toEqual(rigthAnswer);
        done();
      });
    });

    it('should return an error when the retrospective was not found', done => {
      const err = new Error('The retrospective with that id is not found');
      err.title = 'Retrospective not found';
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.reject(err)
      );
      RetrospectiveModel.getRetrospectiveById('59cd078e9ea150295094935a').then(() => {
      }).catch(error => {
        expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59cd078e9ea150295094935a');
        expect(error.message).toEqual('The retrospective with that id is not found');
        expect(error.title).toEqual('Retrospective not found');
        done();
      });
    });

    it('should return an error when the id from the retrospective is invalid', done => {
      spyOn(RetrospectiveDBMock, 'findById').and
        .throwError('Cast to ObjectId failed for value 59cd078e9ea1502950949359s at path _id for model retrospective');
      expect(() => {
        RetrospectiveModel.getRetrospectiveById('59cd078e9ea1502950949359s');
      }).toThrowError('Cast to ObjectId failed for value 59cd078e9ea1502950949359s at path _id for model retrospective');
      done();
    });
  });

  describe('Get items by retrospective', () => {
    it('should retrieve the items that matches with the retrospective id', done => {
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(Promise.resolve({}));
      spyOn(ItemDBMock, 'find').and.returnValue(ItemDBMock);
      spyOn(ItemDBMock, 'populate').and.returnValue(
        {
          populate: () => {
            return Promise.resolve([{
              _id: '59d3bca89dddb9224c0da067',
              summary: 'Code',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              parent: true,
              children: []
            },
            {
              _id: '59d3bcb39dddb9224c0da068',
              summary: 'standard code',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              parent: true,
              children: []
            }]);
          }
        }
      );
      RetrospectiveModel.getItems('59d3bc2872fe0713948f60d1')
        .then(items => {
          expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59d3bc2872fe0713948f60d1');
          expect(ItemDBMock.find).toHaveBeenCalledWith({ 'retrospectiveId': '59d3bc2872fe0713948f60d1', 'parent': true });
          const rigthAnswer = [
            {
              _id: '59d3bca89dddb9224c0da067',
              summary: 'Code',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              parent: true,
              children: []
            },
            {
              _id: '59d3bcb39dddb9224c0da068',
              summary: 'standard code',
              categoryId: '59d3b45572fe0713948f60cf',
              retrospectiveId: '59d3bc2872fe0713948f60d1',
              parent: true,
              children: []
            }
          ];
          expect(items).toEqual(rigthAnswer);
          done();
        });
    });

    it('should return an error when the retrospective was not found', done => {
      const err = new Error('The retrospective with that id is not found');
      err.title = 'Retrospective not found';
      spyOn(RetrospectiveDBMock, 'findById').and.returnValue(
        Promise.reject(err)
      );
      RetrospectiveModel.getItems('59cd078e9ea150295094935a')
        .then(() => {})
        .catch(error => {
          expect(RetrospectiveDBMock.findById).toHaveBeenCalledWith('59cd078e9ea150295094935a');
          expect(error.message).toEqual('The retrospective with that id is not found');
          expect(error.title).toEqual('Retrospective not found');
          done();
        });
    });
  });

  describe('Get retrospectives', () => {
    it('should retrieve the retrospectives storage in the data base', done => {
      spyOn(RetrospectiveDBMock, 'find').and.returnValue(RetrospectiveDBMock);
      spyOn(RetrospectiveDBMock, 'sort').and.returnValue(
        Promise.resolve(
          [
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
          ]
        )
      );
      RetrospectiveModel.getRetrospectives()
        .then(retrospectives => {
          expect(RetrospectiveDBMock.find).toHaveBeenCalled();
          const rigthAnswer =
          [
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
          ];
          expect(retrospectives).toEqual(rigthAnswer);
          done();
        });
    });
  });

  describe('Update retrospective by Id', () => {
    it('should retrieve the restrospective update', done => {
      spyOn(RetrospectiveDBMock, 'findOneAndUpdate').and.returnValue(
        Promise.resolve({
          _id: '59d513cf855bdd3626b224cb',
          name: 'editedRetrospective',
          owner: '5a04692425d95e9db8608292',
          state: 'Votes',
          createDate: '2017-10-25T21:08:42.837Z',
          maxVotes: 5,
          categories: [
            {
              name: 'what went well',
              _id: '59f0fd5a291975487317b817'
            },
            {
              name: 'what did not go well',
              _id: '59f0fd5a291975487317b816'
            }
          ]
        })
      );
      spyOn(RetrospectiveDBMock, 'find').and.returnValue(Promise.resolve({}));

      RetrospectiveModel.updateRetrospective('5a04692425d95e9db8608292', '59d513cf855bdd3626b224cb', { state: 'Votes' })
        .then(retrospective => {
          const rigthAnswer = {
            _id: '59d513cf855bdd3626b224cb',
            name: 'editedRetrospective',
            owner: '5a04692425d95e9db8608292',
            state: 'Votes',
            createDate: '2017-10-25T21:08:42.837Z',
            maxVotes: 5,
            categories: [
              {
                name: 'what went well',
                _id: '59f0fd5a291975487317b817'
              },
              {
                name: 'what did not go well',
                _id: '59f0fd5a291975487317b816'
              }
            ]
          };
          expect(retrospective).toEqual(rigthAnswer);
          done();
        });
    });

    it('should return an error when the retrospective was not update', done => {
      const error = new Error('Validation failed: state: `Begin` is not a valid enum value for path `state`.');
      error.title = 'Invalid Update';
      error.status = 404;
      spyOn(RetrospectiveDBMock, 'findOneAndUpdate').and.returnValue(
        Promise.reject(error)
      );
      spyOn(RetrospectiveDBMock, 'find').and.returnValue(Promise.resolve({}));
      RetrospectiveModel.updateRetrospective('59d513cf855bdd3626b224cb', { state: 'Begin' })
        .then(() => {})
        .catch(err => {
          expect(err.message).toEqual('Validation failed: state: `Begin` is not a valid enum value for path `state`.');
          expect(err.title).toEqual('Invalid Update');
          done();
        });
    });
  });
});
