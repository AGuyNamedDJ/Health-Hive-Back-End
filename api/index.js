const express = require("express");
const apiRouter = express.Router();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

// JWT Middleware


// Routers


    // There should be no ./ here 

// Export
module.exports = { apiRouter }