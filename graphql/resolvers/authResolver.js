const bcrypt = require('bcryptjs');

const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

const User = require('../../models/userModel');

module.exports = {

  // CREATE A NEW ACCOUNT
  signUp: async (args) => {
    try {
      // Email and Username Must be Unique
      let alreadyExist = await User.findOne({ email: args.email });
      if (alreadyExist) {
        throw new Error('Email already used');
      }
      alreadyExist = await User.findOne({ username: args.username });
      if (alreadyExist) {
        throw new Error('Username already used');
      }

      // HASH PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      // CREATE AND SAVE THE NEW USER OBJECT
      const user = new User({
        email: args.email,
        username: args.username,
        password: hashedPassword
      });

      const savedUser = await user.save();

      // PASSWORD IS RETURNED NULL FOR SECURITY
      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },

  // LOGIN TO YOUR ACCOUNT
  login: async (args, req) => {

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error('User does not exist!');
    }

    // CHECK IF PASSWORD IS CORRECT
    const correctPassword = await bcrypt.compare(args.password, user.password);
    if (!correctPassword) {
      throw new Error('Wrong password!');
    }

    // CREATE AND RETURN A JWTR TOKEN
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

  // LOGOUT
  logout: async (args, req) => {
    try {
      if (!req.user)
      {
        return "Already logged out";
      }

      // INVALIDATE THE JWTR TOKEN
      const destroyed = await jwtr.destroy(req.user.jti);
      return "logged out";
    } catch (err) {
      throw err;
    }
  },

};
