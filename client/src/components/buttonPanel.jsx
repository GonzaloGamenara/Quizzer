import "../styles/buttonPanel.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ButtonPanel() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.backgroundImage = "none";
    document.body.style.setProperty("--font-primary", "sans-serif");
    document.body.style.setProperty("--font-secondary", "sans-serif");

    fetch(
      "https://automatic-potato-vx79qggxr42x6vq-5000.app.github.dev/api/quizzes",
      {
        method: "GET",
        credentials: "include", // si estás usando cookies
        redirect: "follow",
      }
    ) // Ruta para obtener todos los quizzes
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false); // ✅ Finaliza carga
      })
      .catch((err) => {
        console.error("❌ Error al cargar quizzes:", err);
        setLoading(false); // ✅ Finaliza carga
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Cargando Quizzes...</p>
      </div>
    );
  }
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
