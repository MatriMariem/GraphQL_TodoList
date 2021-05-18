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

  editTask: async ({ taskId, taskContent }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }
      if (req.user.userId != task.createdBy && !task.sharedWith.includes(req.user.userId)) {
        throw new Error('Access Denied!');
      }
      task.content = taskContent;
      const savedTask = await task.save();
      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },


  checkTask: async ({ taskId }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }
      if (req.user.userId != task.createdBy && !task.sharedWith.includes(req.user.userId)) {
        throw new Error('Access Denied!');
      }
      task.done = !task.done;
      const savedTask = await task.save();
      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },


  deleteTask: async ({ taskId }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }
      if (req.user.userId != task.createdBy) {
        throw new Error('Access Denied!');
      }
// DELETE IT FROM OWNER
    const user = await User.findById(task.createdBy);
    if (user) {
      user.tasks.splice(user.tasks.indexOf(taskId), 1);
      await user.save();
    }

// DELETE IT FROM Users that have this task shared with them
// task.sharedWith.map( async (id) => {
//   const user = await User.findById(id);
//   if (user) {
//     user.sharedWith.splice(user.sharedWith.indexOf(taskId), 1);
//     await user.save();
//   }
// })


      return (task);
    } catch (err) {
      throw err;
    }
  },


};

module.exports = taskResolver;
