import "../styles/quizzConfig.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function QuizzConfig({ cerrarPopup }) {
  const navigate = useNavigate();
  const [musicVolume, setMusicVolume] = useState(50);
  const [effectsVolume, setEffectsVolume] = useState(50);

  return (
    <div className="quizz_config_container">
      <section className="quizz_config_section">
        <h1 className="quizz_config_music">Música</h1>
        <input
          className="quizz_config_music_input"
          type="range"
          min="0"
          max="100"
          value={musicVolume}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
        />
        <h1 className="quizz_config_effects">Efectos</h1>
        <input
          className="quizz_config_effects_input"
          type="range"
          min="0"
          max="100"
          value={effectsVolume}
          onChange={(e) => setEffectsVolume(Number(e.target.value))}
        />
        <button onClick={cerrarPopup} className="quizz_config_back">
          Volver
        </button>
      </section>
    </div>
  );
}
