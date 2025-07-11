import "../styles/optionsScreen.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function OptionsScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quizzData, setQuizzData] = useState(null);
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState("∞");

  useEffect(() => {
    fetch(`http://localhost:5000/api/quizzes/${slug}`)
      .then((res) => res.json())
      .then((data) => setQuizzData(data))
      .catch((err) => console.error("❌ Error al cargar quiz:", err));
  }, [slug]);

  const quantityConfig = Array(4).fill(null);

  return (
    <div className="options-screen">
      <section className="options-section">
        <h1 className="quizz_name">{quizzData?.name || "Cargando..."}</h1>

        <button className="quizz_all_option">Quizz Completo</button>

        {quantityConfig.map((_, index) => (
          <label className="quizz_option" key={index}>
            <input type="checkbox" />
            <span className="text">Texto de prueba</span>
            <span className="icon">🧪</span>
          </label>
        ))}

        <div className="quizz_time_options">
          <p>Tiempo: </p>
          <select onChange={(e) => setTiempoSeleccionado(e.target.value)}>
            <option value="∞">∞</option>
            <option value="1">1 Minuto</option>
            <option value="3">3 Minutos</option>
            <option value="5">5 Minutos</option>
            <option value="10">10 Minutos</option>
            <option value="15">15 Minutos</option>
          </select>
        </div>

        <button
          onClick={() =>
            navigate(`/play/${slug}`, { state: { tiempo: tiempoSeleccionado } })
          }
          className="quizz_start"
        >
          Comenzar
        </button>
      </section>

      <button onClick={() => navigate("/")} className="options-back-button">
        Volver
      </button>
    </div>
  );
}
