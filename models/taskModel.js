const mongoose = require("mongoose")

const taskschema = mongoose.Schema({
    content: String,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    done: {
      type: Boolean,
      default: false
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }],
   createdAt: {
     type: Date,
     default: Date.now
   }
})

module.exports = mongoose.model("Task", taskschema)
