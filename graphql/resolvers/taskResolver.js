const Task = require('../../models/taskModel');
const User = require('../../models/userModel');
const { bindTask } = require('./bind');

const taskResolver = {
  addTask: async ({ taskContent }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }
      const task = new Task({ content: taskContent, createdBy: req.user.userId });
      const savedTask = await task.save();
      let updateduser = await User.updateOne(
        { _id: task.createdBy},
        {$push: {'tasks': task._id}}
      );
      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },
};

module.exports = taskResolver;
