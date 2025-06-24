import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  game_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },

  nickname: { type: String, required: true },
  color: { type: String, required: true },
  is_host: { type: Boolean, default: false },

  score: { type: Number, default: 0 },
  found_elements: [String],

  joined_at: { type: Date, default: Date.now },
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
