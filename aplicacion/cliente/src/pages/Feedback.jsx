//importamos el css
import './styles/Feedback.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Feedback() {
  return (
    <div className='App'>
      <h1>Feedback de la visita</h1>
    </div>
  )
}
