'use strict';

const tv4 = require('tv4');

function validateSchema (schema) {
  return function (req, res, next) {
    const result = tv4.validateResult(req.body, schema);
    if (!result.valid) {
      const error = new Error(result.error.message);
      error.title = 'invalid parameters';
      return next(error);
    }
    return next();
  };
}

exports.validateSchema = validateSchema;
