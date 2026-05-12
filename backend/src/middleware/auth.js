const { auth } = require('express-oauth2-jwt-bearer');

// Validates the Auth0 JWT token on every protected route.
// The token is passed as: Authorization: Bearer <token>
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

module.exports = checkJwt;
