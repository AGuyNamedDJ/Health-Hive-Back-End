// Imports
const express = require('express')
const utilsRouter = express.Router();

// FN: requireUser
function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }

  // FN: requireActiveUser
function requireActiveUser(req, res, next) {
	if (req.user && !req.user.active) {
		next({
			name: 'InactiveUserError',
			message: 'You must be an active user to perform this action',
		});
	}
	next();
}

// Export FNs
  module.exports = {
    requireUser, requireActiveUser,
  }