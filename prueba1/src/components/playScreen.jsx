import "../styles/playScreen.css";

export function PlayScreen({ popUp, goTo, quizz }) {
  //quizz = nombre del quizz, elementos = cantidad ====> esto sera reemplazado por un Data que traera toda la info del quizz desde la DB
  const elementos = 20;

  return (
    <div className="quizz_container">
      <header className="quizz_header">
        <button>Invitar Amigos</button>
        <p>
          Tiempo <span className="quizz_tiempo">00:00:00</span>
        </p>
        <input className="quizz_input" type="search" placeholder="Buscar..." />
        <p className="quizz_puntuacion">
          Puntuacion <span className="quizz_puntuacion_actual">0</span>/
          <span className="quizz_puntuacion_final">100</span>
        </p>
        <p>
          #<span className="quizz_id_jugador">A8B92</span>
        </p>
        <button className="quizz_hint_button">???</button>
      </header>
      <div className="quizz_main">
        {Array.from({ length: elementos }).map((_, index) => (
          <button className="quizz_unknown_button">?</button>
        ))}
      </div>
      <footer className="quizz_footer">
        <button onClick={() => goTo("options")} className="quizz_volver">
          Volver
        </button>
        <button onClick={() => goTo("home")} className="quizz_menu">
          Menu Principal
        </button>
        <button onClick={() => popUp(true)} className="quizz_opciones">
          Opciones
        </button>
      </footer>
    </div>
  );
}
