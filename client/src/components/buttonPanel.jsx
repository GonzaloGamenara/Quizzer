import "../styles/buttonPanel.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ButtonPanel() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    document.body.style.backgroundImage = "none";

    fetch("http://localhost:5000/api/quizzes") // Ruta para obtener todos los quizzes
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("❌ Error al cargar quizzes:", err));
  }, []);

  return (
    <div className="home_container">
      <h1 className="home_tittle">Quizzer</h1>
      <section className="q-button-panel">
        {quizzes.map((quiz) => (
          <button
            key={quiz._id}
            className="q-button"
            onClick={() => navigate(`/options/${quiz.slug}`)}
          >
            <span className="q-button-name">{quiz.name}</span>
          </button>
        ))}
      </section>
    </div>
  );
}
