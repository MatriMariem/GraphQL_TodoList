// MIDDLEWARE TO CHECK AUTHENTICATION FOR INCOMING REQUESTS
const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);


module.exports = async (req, res, next) => {
  const token = req.header('auth-token');

  // IN CASE THE TOKEN DOESN'T EXIST
  if (!token) {
    req.isAuth = false;
    return next();
  }
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  try {
    const verified = await jwtr.verify(token, process.env.SECRET_TOKEN);

    // IN CASE TOKEN EXISTS BUT INVALID
    if (!verified) {
      req.isAuth = false;
      return next();
    }

    // IN CASE TOKEN EXISTS AND VALID
    /* req.user holds the ID of the connected user
      isAuth is a boolean to check if the user is connected
    */
    req.user = verified;
    req.isAuth = true;
    next();

  } catch (err) {
    
    req.isAuth = false;
    return next();
  }

};
