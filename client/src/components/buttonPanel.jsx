import "../styles/buttonPanel.css";
import { useNavigate } from "react-router-dom";

export function ButtonPanel({ b_name }) {
  const navigate = useNavigate();
  const quantityButtons = Array(10).fill(null); //Este array debera contener la lista de quizzes para definir los botones a mostrar

  return (
    <div className="home_container">
      <h1 className="home_tittle">Quizzer</h1>
      <section className="q-button-panel">
        {quantityButtons.map((_, index) => {
          return (
            <button
              key={index}
              className="q-button"
              onClick={() => navigate("/options")}
            >
              <span className="q-button-name">{b_name}</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
