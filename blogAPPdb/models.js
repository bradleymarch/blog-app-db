const mongoose = require("mongoose");
const blogPostSchema = mongoose.Schema(
	{
      title: {type: String, required: true},
      content: {type: String, required: true},
      author: {
      	firstName: String,
      	lastName: String
      },
      created: {type: String, required: true}
});

//virtuals go here

blogPostSchema.virtual('authorName').get(function() {
	return `${this.firstName} ${this.lastName}`.trim()
});



