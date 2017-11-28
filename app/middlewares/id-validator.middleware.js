'use strict';
const mongoose = require('mongoose');
function validateId (id) {
  return function validation (req, res, next) {
    const result = mongoose.Types.ObjectId.isValid(req.params[id]);
    if (!result) {
      const error = new Error('Id format is not valid');
      error.title = 'Invalid Id';
      error.status = 400;
      return next(error);
    }
    return next();
  };
}

exports.validateId = validateId;
