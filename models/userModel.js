const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  username: {
    type: String,
		unique: true,
		required: true,
  },
  email: {
    type: String,
    unique: true,
		required: true
  },
  password: {
		type: String,
		required: true
	},
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}],
	sharedTasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}],
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
})

module.exports = mongoose.model("User", userschema)
