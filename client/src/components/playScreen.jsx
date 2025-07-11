import "../styles/playScreen.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { QuizzConfig } from "./quizzConfig";
import { useLocation, useParams } from "react-router-dom";

export function PlayScreen({ quizz }) {
  const { state } = useLocation();
  const { slug } = useParams();
  const tiempoInicial =
    state?.tiempo === "∞" ? null : parseInt(state.tiempo, 10) * 60;
  const [quizzData, setQuizzData] = useState(null);
  const [jugador, setJugador] = useState({
    id: "A8B92",
    nombre: "Vos",
    color: "blue",
    respuestas: [],
  });
  const [respuestaActual, setRespuestaActual] = useState("");
  const [ultimoAcertado, setUltimoAcertado] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoInicial);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quizzes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizzData(data);

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

        const secondaryFont = data.fonts?.secondary;
        if (secondaryFont?.import?.endsWith(".ttf")) {
          const font = new FontFace(
            secondaryFont.name,
            `url(${secondaryFont.import})`
          );
          font
            .load()
            .then((loadedFont) => {
              document.fonts.add(loadedFont);
              document.body.style.setProperty(
                "--font-secondary",
                `'${secondaryFont.name}', sans-serif`
              );
            })
            .catch((err) => {
              console.error("❌ Error cargando fuente secundaria:", err);
            });
        }
      })
      .catch((err) => console.error("❌ Error al cargar quiz:", err));
  }, []);

  useEffect(() => {
    if (tiempoRestante === null) return; // Tiempo infinito
    if (tiempoRestante <= 0) return; // Tiempo agotado

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoRestante]);

  const ELEMENT_COUNT = quizzData?.elements?.length || 0;

  const navigate = useNavigate();
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [{ cols, rows }, setGrid] = useState({ cols: 1, rows: ELEMENT_COUNT });

  const fontSize = `calc(100vmin / ${cols * 1.5})`;
  const gap = `calc(100vmin / ${cols * 5})`;
  const borderRadius = `calc(100vmin / ${cols * 5})`;

  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const computeGrid = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;

      const aspect = width / height;
      const newCols = Math.ceil(Math.sqrt(ELEMENT_COUNT * aspect));
      const newRows = Math.ceil(ELEMENT_COUNT / newCols);
      setGrid({ cols: newCols, rows: newRows });
    };

    computeGrid();
    const ro = new ResizeObserver(computeGrid);
    ro.observe(el);

    return () => ro.disconnect();
  }, [ELEMENT_COUNT]);

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .replace(/[^a-z0-9\s]/g, "") // saca caracteres raros
      .trim();
  }

  function validarRespuesta(input) {
    setRespuestaActual(input);
    const respuesta = normalizar(input);

    const coincidencia = quizzData.elements.find(
      (el) =>
        normalizar(el.element_name) === respuesta &&
        !jugador.respuestas.includes(el.element_id)
    );

    if (coincidencia) {
      // 🔊 Sonido
      const sonido = new Audio("/sounds/acierto.wav");
      sonido.currentTime = 0;
      sonido.play();

      // 💥 Marca para animación
      setUltimoAcertado(coincidencia.element_id);

      // ✅ Agrega a respuestas
      setJugador((prev) => ({
        ...prev,
        respuestas: [...prev.respuestas, coincidencia.element_id],
      }));

      setRespuestaActual(""); // Limpia el input al acertar
    }
  }

  return (
    <div className="quizz_container">
      <header className="quizz_header">
        <button>Invitar Amigos</button>
        <p>
          Tiempo{" "}
          <span className="quizz_tiempo">
            {tiempoRestante !== null
              ? `${Math.floor(tiempoRestante / 60)
                  .toString()
                  .padStart(2, "0")}:${(tiempoRestante % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "∞"}
          </span>
        </p>
        <input
          className="quizz_input"
          type="search"
          placeholder="Buscar..."
          value={respuestaActual}
          onChange={(e) => validarRespuesta(e.target.value)}
        />
        <p className="quizz_puntuacion">
          Puntuacion{" "}
          <span className="quizz_puntuacion_actual">
            {jugador.respuestas.length}/
          </span>
          <span className="quizz_puntuacion_final">{ELEMENT_COUNT}</span>
        </p>
        <p className="quizz_id_jugador">
          #<span>{jugador.id}</span>
        </p>
        <button className="quizz_hint_button">???</button>
      </header>

      <div
        ref={gridRef}
        className="quizz_main"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          fontSize: `${fontSize}`,
          gap: `${gap}`,
        }}
      >
        {quizzData?.elements?.map((element) => (
          <div
            key={element.element_id}
            className={`quizz_unknown_div ${
              jugador.respuestas.includes(element.element_id) &&
              element.element_id === ultimoAcertado
                ? "quizz_acertado"
                : ""
            }`}
            style={{
              borderRadius: `${borderRadius}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {jugador.respuestas.includes(element.element_id) ? (
              <img
                src={element.metadata.image}
                alt={element.element_name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>

      <footer className="quizz_footer">
        <button
          onClick={() => navigate(`/options/${slug}`)}
          className="quizz_volver"
        >
          Volver
        </button>
        <button onClick={() => navigate("/")} className="quizz_menu">
          Menu Principal
        </button>
        <button
          onClick={() => setMostrarConfig(true)}
          className="quizz_opciones"
        >
          Opciones
        </button>
      </footer>

      {mostrarConfig && (
        <QuizzConfig cerrarPopup={() => setMostrarConfig(false)} />
      )}
    </div>
  );
}
