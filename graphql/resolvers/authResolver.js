const bcrypt = require('bcryptjs');

const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

const User = require('../../models/userModel');

module.exports = {
  signUp: async (args) => {
    try {
      let alreadyExist = await User.findOne({ email: args.email });
      if (alreadyExist) {
        throw new Error('Email already used');
      }
      alreadyExist = await User.findOne({ username: args.username });
      if (alreadyExist) {
        throw new Error('Username already used');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      const user = new User({
        email: args.email,
        username: args.username,
        password: hashedPassword
      });

      const savedUser = await user.save();
      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },

  login: async (args, req, res) => {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const correctPassword = await bcrypt.compare(args.password, user.password);
    if (!correctPassword) {
      throw new Error('Wrong password!');
    }
    try {
    const token = jwtr.sign(
      {"userId": user._id},
      process.env.SECRET_TOKEN
    );
    return ({token: token, userId: user._id,});
  }
    catch(error){
      console.log(`error = ${error}`);
      throw new Error('Cannot login!');
    };
  },

  logout: async (args, req) => {
    try {
      if (!req.user)
      {
        return "Already logged out";
      }
      const destroyed = await jwtr.destroy(req.user.jti);
      // res.header('auth-token', '');
      return "logged out";
    } catch (err) {
      throw err;
    }
  },

};
