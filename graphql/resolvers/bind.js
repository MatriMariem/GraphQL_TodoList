const User = require('../../models/userModel');
const Task = require('../../models/taskModel');
const Comment = require('../../models/commentModel');

const bindTask = async (taskId) => {
  try {
    const task = await Task.findById(taskId);
    return {
      ...task._doc,
      _id: task.id,
      createdBy: bindUser.bind(this, task._doc.createdBy),
      sharedWith: bindusers.bind(this, task._doc.sharedWith),
      comments: bindcomments.bind(this, task._doc.comments)
    };
  } catch (err) {
    throw err;
  }
};

const bindUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      tasks: bindtasks.bind(this, user._doc.tasks),
      sharedTasks: bindtasks.bind(this, user._doc.sharedTasks),
      comments: bindcomments.bind(this, user._doc.comments)
    };
  } catch (err) {
    throw err;
  }
};

const bindComment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    return {
      ...comment._doc,
      _id: comment.id,
      createdBy: bindUser.bind(this, comment._doc.createdBy),
      createdIn: bindTask.bind(this, comment._doc.createdIn)
    };
  } catch (err) {
    throw err;
  }
};

const bindusers = async (users) => {
  try {
    return users.map((u) => { return bindUser(u); });
  } catch (err) {
    throw err;
  }
};
const bindtasks = async (tasks) => {
  try {
    return tasks.map((t) => { return bindTask(t); });
  } catch (err) {
    throw err;
  }
};
const bindcomments = async (comments) => {
  try {
    return comments.map((c) => { return bindComment(c); });
  } catch (err) {
    throw err;
  }
};
module.exports = {
  bindTask,
  bindUser,
  bindComment,
  bindusers,
  bindtasks,
  bindcomments
}
