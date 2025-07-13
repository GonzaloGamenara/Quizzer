import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import quizzRoutes from "./routes/quizz.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Habilitar CORS con frontend específico y credenciales
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Forzar cabecera CORS necesaria en Codespaces
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use("/api/quizzes", quizzRoutes);

app.get("/", (req, res) => {
  res.send("¡API de Quizzer funcionando!");
});

console.log("🌍 Variables de entorno cargadas:");

mongoose
  .connect(
    "mongodb+srv://gonzagamenara:yoDVhYxam3FEhXrs@cluster0.lcnbabp.mongodb.net/quizzer?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error conectando Mongo:", err));
