import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from "./pages/Inicio";
import Formulario from "./pages/Formulario";
import Feedback from "./pages/Feedback";
import Logo from "./pages/images/logo.png";

function App() {
  return (
    <Router>
      <div className="insene">
        <div className="logo">
          <img src={Logo} alt="Insene" />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );

}

export default App;