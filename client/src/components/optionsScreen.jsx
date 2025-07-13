import "../styles/optionsScreen.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function OptionsScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quizzData, setQuizzData] = useState(null);
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState("∞");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://automatic-potato-vx79qggxr42x6vq-5000.app.github.dev/api/quizzes/${slug}`,
      {
        method: "GET",
        credentials: "include", // si estás usando cookies
        redirect: "follow",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setQuizzData(data);
        setLoading(false);
        // 🖼 Aplicar imagen de fondo si existe
        if (data.background_image) {
          document.body.style.backgroundImage = `url(${data.background_image})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundRepeat = "no-repeat";
        }

        // 🧠 Cargar fuentes si existen
        const primaryFont = data.fonts?.primary;
        if (primaryFont?.import?.endsWith(".ttf")) {
          const font = new FontFace(
            primaryFont.name,
            `url(${primaryFont.import})`
          );
          font
            .load()
            .then((loadedFont) => {
              document.fonts.add(loadedFont);
              document.body.style.setProperty(
                "--font-primary",
                `'${primaryFont.name}', sans-serif`
              );
            })
            .catch((err) => {
              console.error("❌ Error cargando fuente primaria:", err);
            });
        }
      })
      .catch((err) => {
        console.error("❌ Error al cargar quiz:", err), setLoading(false);
      });
  }, [slug]);

  //const quantityConfig = Array(4).fill(null);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Cargando Quizz...</p>
      </div>
    );
  }

  return (
    <div className="options-screen">
      <section className="options-section">
        <h1 className="quizz_name">{quizzData?.name || "Cargando..."}</h1>

        {/*  <button className="quizz_all_option">Quizz Completo</button>

        {quantityConfig.map((_, index) => (
          <label className="quizz_option" key={index}>
            <input type="checkbox" />
            <span className="text">Texto de prueba</span>
            <span className="icon">🧪</span>
          </label>
        ))}*/}

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
