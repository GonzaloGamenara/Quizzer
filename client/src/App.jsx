import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ButtonPanel } from "./components/buttonPanel.jsx";
import { OptionsScreen } from "./components/optionsScreen.jsx";
import { PlayScreen } from "./components/playScreen.jsx";
import { QuizzConfig } from "./components/quizzConfig.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ButtonPanel b_name="Quizz" />} />
        <Route path="/options/:slug" element={<OptionsScreen />} />
        <Route path="/play/:slug" element={<PlayScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
