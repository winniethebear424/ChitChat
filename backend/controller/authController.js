const jwt = require('jsonwebtoken');
const { auth } = require("express-oauth2-jwt-bearer");
const catchAsync = require('../utils/catchAsync');

const jwtChech = auth({
    audience: "https://localhost:3000/auth",
    issuerBaseURL: "https://dev-flqipezmfqvqvfwt.us.auth0.com",
    tokenSigningAlgorithm: "RS256",
});

const userHandler = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    req.user = decoded.sub;
    next();
  });

module.exports = {
    userHandler,
    jwtChech,
}
