import express from "express";
import Quiz from "../models/Quiz.js";
import QuizzElement from "../models/Quizz_element.js";

const router = express.Router();

// GET /api/quizzes/:slug
router.get("/:slug", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug });
    if (!quiz) return res.status(404).json({ message: "Quiz no encontrado" });

    const elements = await QuizzElement.find({ quizz_id: quiz._id });

    res.json({ ...quiz.toObject(), elements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
