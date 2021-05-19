const User = require('../../models/userModel');
const Task = require('../../models/taskModel');
const Comment = require('../../models/commentModel');
const { bindusers, bindtasks, bindcomments, bindUser } = require('./bind');


const generalResolver = {

  // GET ALL USERS
  users: async () => {
    try {

      const users = await User.find();

      // bindusers FUNCTION IS USED TO GET SUBFIELDS OF NESTED OBJECTS
      return bindusers(users);

    } catch (err) {
      throw err;
    }
  },

  // GET A USER BY USERNAME
  user: async ({username}) => {
    try {

      const user = await User.findOne({username: username});

      // bindusers FUNCTION IS USED TO GET SUBFIELDS OF NESTED OBJECTS
      return bindUser(user);

    } catch (err) {
      throw err;
    }
  },

  // GET ALL TASKS OF A SPECIFIC USER
  tasks: async ({userId}) => {
    try {
      const tasks = await Task.find({createdBy: userId});
      return bindtasks(tasks);
    } catch (err) {
      throw err;
    }
  },

  // GET ALL COMMENTS IN A SPECIFIC TASK
  comments: async ({taskId}) => {
    try {
      const comments = await Comment.find({createdIn: taskId});
      return bindcomments(comments);
    } catch (err) {
      throw err;
    }
  },

};

module.exports = generalResolver;
