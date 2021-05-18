const User = require('../../models/userModel');
const Task = require('../../models/taskModel');
const Comment = require('../../models/commentModel');
const generalResolver = {


  users: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (err) {
      throw err;
    }
  },

  tasks: async ({userId}) => {
    try {
      const tasks = await Task.find({createdBy: userId});
      return tasks;
    } catch (err) {
      throw err;
    }
  },

  comments: async ({taskId}) => {
    try {
      const comments = await Comment.find({createdIn: taskId});
      return comments;
    } catch (err) {
      throw err;
    }
  },

};

module.exports = generalResolver;
