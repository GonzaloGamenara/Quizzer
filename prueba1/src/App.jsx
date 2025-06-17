import { useState } from "react";
import "./App.css";
import { ButtonPanel } from "./components/buttonPanel.jsx";
import { OptionsScreen } from "./components/optionsScreen.jsx";

function App() {
  const [showOptions, setShowOptions] = useState(false);

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <>
      {!showOptions && (
        <>
          <h1 className="tittle">Quizzer</h1>
          <ButtonPanel onButtonClick={handleButtonClick} b_name="Button Name" />
        </>
      )}
      {showOptions && (
        <OptionsScreen
          onButtonClick={handleButtonClick}
          quizz_name="Quizz Name"
        />
      )}
    </>
  );
}
export default App;
