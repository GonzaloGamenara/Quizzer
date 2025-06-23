import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  backgrodundImage: { type: String, required: true },
  fonts: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
