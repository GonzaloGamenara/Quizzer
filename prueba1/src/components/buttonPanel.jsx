import "../styles/ButtonPanel.css";

export function ButtonPanel({ onButtonClick, b_name }) {
  const quantityButtons = Array(4).fill(null); //Este array debera contener la lista de quizzes para definir los botones a mostrar

  return (
    <section className="q-button-panel">
      {quantityButtons.map((_, index) => {
        return (
          <button onClick={onButtonClick} key={index} className="q-button">
            <span className="q-button-name">{b_name}</span>
          </button>
        );
      })}
    </section>
  );
}
