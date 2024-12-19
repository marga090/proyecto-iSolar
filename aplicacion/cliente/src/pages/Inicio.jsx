import React from 'react';

import "./styles/Inicio.css";

export default function Inicio() {
  return (
    <div>
      <header>
        <div className="logo">
          <img src="imagenes/LOGO.jpg" alt="INSENE energía" />
          <h1>INSENE SOLAR</h1>
        </div>
        <nav className="navbar">
          <a href="#home">Página Principal</a>
          <a href="#comerciales">Comerciales</a>
          <a href="#captadores">Captadores</a>
          <a href="#login">Iniciar sesión</a>
        </nav>
        <div className="menu-icon">&#9776;</div>
      </header>
      <div className="main-content">
        <img src="imagenes/energia verde.jpg" alt="Solar and Wind Energy" />
        <div className="buttons">
          <a href="#comerciales">COMERCIALES</a>
          <a href="#captadores">CAPTADORES</a>
        </div>
      </div>
      <footer>
        <p>Copyright © 2024. All rights reserved.</p>
      </footer>
    </div>
  );
}