const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  creationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  topicCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  topicQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("Topic", TopicSchema)

const topicModel = mongoose.model("Topic", topicSchema);

module.exports = topicModel;
