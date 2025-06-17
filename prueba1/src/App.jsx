import { useState } from "react";
import "./App.css";
import { ButtonPanel } from "./components/buttonPanel.jsx";
import { OptionsScreen } from "./components/optionsScreen.jsx";
import { PlayScreen } from "./components/playScreen.jsx";

function App() {
  const [screen, setScreen] = useState("home"); //home, options, play

  const goTo = (newScreen) => setScreen(newScreen);

  return (
    <>
      {screen == "home" && 
      <ButtonPanel goTo={goTo} />}
      {screen == "options" && <OptionsScreen goTo={goTo} />}
      {screen == "play" && <PlayScreen goTo={goTo} />}
    </>
  );
}
export default App;
