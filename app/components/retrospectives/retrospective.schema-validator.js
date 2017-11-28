'use strict';

const RetrospectiveSchema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      'minLength': 1
    },
    'categories': {
      'type': 'array',
      'minItems': 1,
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string',
            'minLength': 1
          },
          'color': {
            'type': 'string',
            'minLength': 1
          }
        }
      }
    }
  },
  'required': ['name', 'categories']
};

module.exports = RetrospectiveSchema;
