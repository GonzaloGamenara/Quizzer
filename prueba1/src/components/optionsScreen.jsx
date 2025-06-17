import "../styles/optionsScreen.css";

export function OptionsScreen({ goTo, quizz_name }) {
  //esta funcion recibira la data completa del quizz
  const quantityConfig = Array(4).fill(null); //este array contendra la lista de config del quizz seleccionado

  return (
    <div className="options-screen">
      <section className="options-section">
        <h1 className="quizz_name">{quizz_name}</h1>
        <button className="quizz_all_option">Quizz Completo</button>
        {quantityConfig.map((_, index) => {
          return (
            <label className="quizz_option" key={index}>
              <input type="checkbox" />
              <span className="text">Texto de prueba</span>
              <span className="icon">🧪</span>
            </label>
          );
        })}
        <div className="quizz_time_options">
          <p>Tiempo: </p>
          <button>∞</button>/
          <select>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="20">20 min</option>
          </select>
        </div>
        <button onClick={() => goTo("play")} className="quizz_start">
          Comenzar
        </button>
      </section>
      <button onClick={() => goTo("home")} className="options-back-button">
        Volver
      </button>
    </div>
  );
}
