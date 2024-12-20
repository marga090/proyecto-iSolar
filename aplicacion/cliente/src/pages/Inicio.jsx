import React from 'react';
import "./styles/Inicio.css";
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();

  const comprobarTrabajador = (opcion) => {
    if (opcion === 'formulario') {
      navigate('/formulario');
    } else if (opcion === 'feedback') {
      navigate('/feedback');
    }
  };

  return (
    <div className='inicioSesion'>
      <h1>Inicio de Sesión</h1>
      <p>¿Eres un captador o un comercial?</p>
      <button onClick={() => comprobarTrabajador('formulario')}>Captador</button>
      <button onClick={() => comprobarTrabajador('feedback')}>Comercial</button>
    </div>
  );
};

export default Inicio;