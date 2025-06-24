import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  quizz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },

  settings: {
    filter: { type: String },
    time_limit: { type: Number },
    allow_hints: { type: Boolean, default: true },
    multiplayer: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ["waiting", "in_progress", "finished"],
    default: "waiting",
  },

  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],

  started_at: { type: Date },
  ended_at: { type: Date },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
