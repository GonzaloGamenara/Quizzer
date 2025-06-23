import mongoose from "mongoose";

const quizzElementSchema = new mongoose.Schema({
  quizz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  element_id: { type: String },
  element_name: { type: String, required: true },
  metadata: {
    hint: { type: String },
    image: { type: String },
    extra: { type: mongoose.Schema.Types.Mixed },
  },
  tags: [String],
});

const QuizzElement = mongoose.model("QuizzElement", quizzElementSchema);
export default QuizzElement;
