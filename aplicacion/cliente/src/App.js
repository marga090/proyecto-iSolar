import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Inicio";
import Formulario from "./pages/Formulario";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/formulario">Formulario</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );

}

export default App;