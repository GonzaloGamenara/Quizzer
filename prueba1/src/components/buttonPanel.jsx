import "../styles/buttonPanel.css";

export function ButtonPanel({ goTo, b_name }) {
  const quantityButtons = Array(4).fill(null); //Este array debera contener la lista de quizzes para definir los botones a mostrar

  return (
    <>
      <h1 className="home_tittle">Quizzer</h1>
      <section className="q-button-panel">
        {quantityButtons.map((_, index) => {
          return (
            <button
              onClick={() => goTo("options")}
              key={index}
              className="q-button"
            >
              <span className="q-button-name">{b_name}</span>
            </button>
          );
        })}
      </section>
    </>
  );
}
