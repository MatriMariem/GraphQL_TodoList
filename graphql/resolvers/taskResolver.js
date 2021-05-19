const Task = require('../../models/taskModel');
const User = require('../../models/userModel');
const Comment = require('../../models/commentModel');
const { bindTask } = require('./bind');

const taskResolver = {

  // CREATE A NEW TASK
  addTask: async ({ taskContent }, req) => {
    try {

      // THE USER MUST BE CONNECTED
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }

      // CREATE AND SAVE THE TASK OBJECT
      const task = new Task({ content: taskContent, createdBy: req.user.userId });
      const savedTask = await task.save();

      // ADD THE TASK TO THE USER OBJECT TASKS LIST
      let updateduser = await User.updateOne(
        { _id: task.createdBy},
        {$push: {'tasks': task._id}}
      );

      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },

  // SHARE A TASK WITH ANOTHER USER
  shareTask: async ({ userId, taskId }, req) => {
    try {

      // THE USER MUST BE CONNECTED
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }

      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }

      /* IN ORDER TO SHARE THE TASK WITH ANOTHER USER, YOU MUST BE:
      - THE OWNER OF THE TASK OR
      - ONE OF THE MEMBERS TO WHOM THAT TASK WAS SHARED WITH
      */
      if (req.user.userId != task.createdBy && !task.sharedWith.includes(req.user.userId)) {
        throw new Error('Access Denied!');
      }

      if (userId == task.createdBy) {
        throw new Error("you cannot share the task with its owner");
      }

      if (task.sharedWith.includes(userId)) {
        throw new Error("Already added!");
      }

      task.sharedWith.push(userId);
      const savedTask = await task.save();

      let updateduser = await User.updateOne(
        { _id: userId},
        {$push: {'sharedTasks': taskId}}
      );

      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },


  // EDIT THE CONTENT OF A TASK
  editTask: async ({ taskId, taskContent }, req) => {
    try {

      /* THE USER MUST BE CONNECTED +
      ONLY THE OWNER AND THE USERS ADDED TO THE TASK, CAN EDIT ITS CONTENT */
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


    // ADD A COMMENT TO A TASK
    commentTask: async ({ taskId, commentContent }, req) => {
      try {
        // THE USER MUST BE CONNECTED
        if (!req.isAuth) {
          throw new Error('Unauthorized!');
        }


        const task = await Task.findById(taskId);
        if (!task) {
          throw new Error('Not found!');
        }

        // ONLY OWNER OR ADDED USERS CAN COMMENT THE TASK
        if (req.user.userId != task.createdBy && !task.sharedWith.includes(req.user.userId)) {
          throw new Error('Access Denied!');
        }

        // CREATE AND SAVE THE COMMENT
        const comment = new Comment({ content: commentContent, createdBy: req.user.userId, createdIn: taskId });
        const savedComment = await comment.save();

        // ADD THE COMMENT TO THE USER OBJECT
        let updateduser = await User.updateOne(
          { _id: comment.createdBy},
          {$push: {'comments': comment._id}}
        );

        // ADD THE COMMENT TO THE TASK OBJECT
        task.comments.push(comment._id)
        const savedTask = await task.save();


        return (bindTask(savedTask));
      } catch (err) {
        throw err;
      }
    },

  // CHANGE THE STATUS OF THE TASK (COMPLETED/UNCOMPLETED)
  checkTask: async ({ taskId }, req) => {
    try {

      // THE USER MUST BE CONNECTED
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }

      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }

      // ONLY OWNER AND ADDED USERS CAN CHANGE THE STATUS OF THE TASK
      if (req.user.userId != task.createdBy && !task.sharedWith.includes(req.user.userId)) {
        throw new Error('Access Denied!');
      }

      // THE STATUS CHANGES EVERYTIME THIS RESOLVER IS CALLED
      task.done = !task.done;
      const savedTask = await task.save();

      return (bindTask(savedTask));
    } catch (err) {
      throw err;
    }
  },

  // DELETE A TASK
  deleteTask: async ({ taskId }, req) => {
    try {

      // THE USER MUST BE CONNECTED
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }


      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Not found!');
      }

      // ONLY THE OWNER OF THE TASK CAN DELETE THE TASK
      if (req.user.userId != task.createdBy) {
        throw new Error('Access Denied!');
      }

      // DELETE THE TASK FROM OWNER OBJECT
    const user = await User.findById(task.createdBy);
    if (user) {
      user.tasks.splice(user.tasks.indexOf(taskId), 1);
      await user.save();
    }

    // DELETE IT FROM ADDED USERS OBJECTS
  task.sharedWith.map( async (id) => {
    const user = await User.findById(id);
    if (user) {
      user.sharedTasks.splice(user.sharedTasks.indexOf(taskId), 1);
      await user.save();
    }
  })

  // DELETE THE COMMENTS OF THAT TASK
    task.comments.map( async (id) => {
      const comment = await Comment.findById(id);
      if (comment) {
        // DELETE EACH COMMENT FROM THE OWNER USER OBJECT
        const user = await User.findById(comment.createdBy);
        user.comments.splice(user.comments.indexOf(id), 1);
        await user.save();
        // DELETE THE COMMENT OBJECT
        const removedComment = await Comment.remove({ _id: id });
      }
    })

    // DELETE THE TASK OBJECT
    const removedTask = await Task.remove({ _id: taskId });

    return (task);
    } catch (err) {
      throw err;
    }
  },


  // DELETE A COMMENT
  deleteComment: async ({ commentId }, req) => {
    try {

      // THE USER MUST BE CONNECTED
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }


      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Not found!');
      }

      // ONLY THE OWNER OF THE COMMENT CAN DELETE THE COMMENT
      if (req.user.userId != comment.createdBy) {
        throw new Error('Access Denied!');
      }


      const task = await Task.findById(comment.createdIn);
      if (task) {
        // DELETE THE COMMENT FROM TASK OBJECT
        task.comments.splice(task.comments.indexOf(commentId), 1);
        await task.save();
      }


      const user = await User.findById(comment.createdBy);
      if (user) {
        // DELETE THE COMMENT FROM USER OBJECT
        user.comments.splice(user.comments.indexOf(commentId), 1);
        await user.save();
      }


    // DELETE THE COMMENT
    const removedComment = await Comment.remove({ _id: commentId });

    return (comment);
    } catch (err) {
      throw err;
    }
  },


};

module.exports = taskResolver;
