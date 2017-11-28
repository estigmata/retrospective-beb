'use strict';

const ItemSchema = {
  'type': 'object',
  'properties': {
    'summary': {
      'type': 'string',
      'minLength': 1
    },
    'categoryId': {
      'type': 'string',
      'minLength': 1
    },
    'retrospectiveId': {
      'type': 'string',
      'minLength': 1
    }
  },
  'required': ['retrospectiveId', 'categoryId']
};

module.exports = ItemSchema;
