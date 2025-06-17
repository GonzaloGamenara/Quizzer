import "../styles/optionsScreen.css";
import { useState } from "react";

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
            <button className="quizz_option" key={index}>
              <span className="text">Texto de prueba</span>
              <span className="icon">🧪</span>
            </button>
          );
        })}
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
