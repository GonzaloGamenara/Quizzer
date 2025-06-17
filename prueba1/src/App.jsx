import { useState } from "react";
import "./App.css";
import { ButtonPanel } from "./components/buttonPanel.jsx";
import { OptionsScreen } from "./components/optionsScreen.jsx";
import { PlayScreen } from "./components/playScreen.jsx";
import { QuizzConfig } from "./components/quizzConfig.jsx";

function App() {
  const [screen, setScreen] = useState("home"); //home, options, play
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const goTo = (newScreen) => setScreen(newScreen);
  const popUp = (show) => setMostrarConfig(show);

  return (
    <>
      {screen == "home" && <ButtonPanel goTo={goTo} b_name={"Quizz"} />}
      {screen == "options" && (
        <OptionsScreen goTo={goTo} quizz_name="Nombre Quizz" />
      )}
      {screen == "play" && <PlayScreen goTo={goTo} popUp={popUp} />}

      {mostrarConfig == true && <QuizzConfig popUp={popUp} />}
    </>
  );
}
export default App;
