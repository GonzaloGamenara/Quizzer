import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Quiz from "../models/Quiz.js";
import QuizzElement from "../models/Quizz_element.js";

dotenv.config();

async function seedQuiz() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Leer archivo JSON
    const filePath = path.resolve("scripts", "quiz_data.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const { quiz, elements } = JSON.parse(rawData);

    // Insertar quiz
    const newQuiz = await Quiz.create(quiz);
    console.log(`🎮 Quiz insertado: ${newQuiz.name}`);

    // Insertar elementos con quizz_id
    const elementsToInsert = elements.map((el) => ({
      ...el,
      quizz_id: newQuiz._id,
    }));

    await QuizzElement.insertMany(elementsToInsert);
    console.log(`📦 ${elements.length} elementos insertados.`);

    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB. Listo.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.disconnect();
  }
}

seedQuiz();
