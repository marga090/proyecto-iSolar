//importamos el css
import './styles/Feedback.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Feedback() {
  // creamos las constantes para obtener los valores de los campos del formulario
  const [modoCaptacion, setModoCaptacion] = useState("");
  const [resultadoVisita, setResultadoVisita] = useState("");
  const [tipoVisita, setTipoVisita] = useState("");

  return (
    <div className='feedback'>
      <h1>Feedback de la visita</h1>

      <div className='contenedorFeedback'>
        <div className='campos'>
          {/* <label>ID Trabajador:</label>
          <input
            onChange={(event) => setIdTrabajador(event.target.value)}
            type="text"
            placeholder="Introduce el ID del trabajador"
          /> */}
          <label className='nombreCampo'>Modo de captación:</label>
          <select
            onChange={(event) => setModoCaptacion(event.target.value)}
            value={modoCaptacion}
          >
            <option value="">Selecciona un modo de captación</option>
            <option value="Captador">Captador</option>
            <option value="Telemarketing">Telemarketing</option>
            <option value="Referido">Referido</option>
            <option value="Propia"> Captación propia</option>
          </select>

          <label className='nombreCampo'>Fecha de la visita:</label>
          <input className='campoTexto'
            onChange={(event) => (event.target.value)}
            type="date"
            placeholder="Introduce la fecha de la visita"
          />

          <label className='nombreCampo'>Hora de la visita:</label>
          <input className='campoTexto'
            onChange={(event) => (event.target.value)}
            type="time"
            placeholder="Introduce la hora de la visita"
          />

          <label className='nombreCampo'>Resultado de la visita:</label>
          <select
            onChange={(event) => setResultadoVisita(event.target.value)}
            value={resultadoVisita}
          >
            <option value="">Selecciona el resultado de la visita</option>
            <option value="VisitadoPdteCont">Visitado pendiente de contestación</option>
            <option value="VisitadoNada">Visitado no hacen nada</option>
            <option value="Recitar">Recitar</option>
            <option value="NoVisita">No visita</option>
            <option value="FirmadaNoFinan">Firmada-No financiable</option>
            <option value="Venta">Venta</option>
          </select>

          <label className='nombreCampo'>Tipo de la visita:</label>
          <select
            onChange={(event) => setTipoVisita(event.target.value)}
            value={resultadoVisita}
          >
            <option value="">Selecciona el tipo de la visita</option>
            <option value="Corta">Visita de 1 hora (Corta)</option>
            <option value="Media">Visita de 2 horas (Media)</option>
            <option value="Larga">Visita de 3 horas (Larga)</option>
          </select>

        </div>
      </div>
    </div>
  )
}
