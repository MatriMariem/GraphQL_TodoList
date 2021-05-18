const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

module.exports = async (req, res, next) => {
  const token = req.header('auth-token');
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
    if (!verified) {
      req.isAuth = false;
      return next();
    }
    req.user = verified;
    req.isAuth = true;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }

};
