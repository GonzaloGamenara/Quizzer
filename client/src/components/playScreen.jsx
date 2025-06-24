import "../styles/playScreen.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { QuizzConfig } from "./quizzConfig";

export function PlayScreen({ quizz }) {
  const [quizzData, setQuizzData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes/clubes-argentinos")
      .then((res) => res.json())
      .then((data) => setQuizzData(data))
      .catch((err) => console.error("❌ Error al cargar quiz:", err));
  }, []);

  const ELEMENT_COUNT = quizzData?.elements?.length || 0;

  const navigate = useNavigate();
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [{ cols, rows }, setGrid] = useState({ cols: 1, rows: ELEMENT_COUNT });

  /*Variables*/

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

  return (
    <div className="quizz_container">
      <header className="quizz_header">
        <button>Invitar Amigos</button>
        <p>
          Tiempo <span className="quizz_tiempo">00:00</span>
        </p>
        <input className="quizz_input" type="search" placeholder="Buscar..." />
        <p className="quizz_puntuacion">
          Puntuación <span className="quizz_puntuacion_actual">0</span>/
          <span className="quizz_puntuacion_final">{ELEMENT_COUNT}</span>
        </p>
        <p>
          #<span className="quizz_id_jugador">A8B92</span>
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
        {Array.from({ length: ELEMENT_COUNT }).map((_, i) => (
          <div
            key={i}
            className="quizz_unknown_div"
            style={{ borderRadius: `${borderRadius}` }}
          >
            ?
          </div>
        ))}
      </div>

      <footer className="quizz_footer">
        <button onClick={() => navigate("/options")} className="quizz_volver">
          Volver
        </button>
        <button onClick={() => navigate("/")} className="quizz_menu">
          Menú Principal
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
