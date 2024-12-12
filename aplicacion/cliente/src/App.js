import './App.css';
import { useState } from "react";
import Axios from "axios";

function App() {

  const [idCliente, setIdCliente] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [direccionContacto, setDireccionContacto] = useState("");
  const [localidadContacto, setLocalidadContacto] = useState("");
  const [provinciaContacto, setProvinciaContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [observacionesContacto, setObservacionesContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [modoCaptacion, setModoCaptacion] = useState("");

  const add = () =>
    Axios.post("http://localhost:3001/create", {
      idCliente: idCliente,
      nombreContacto: nombreContacto,
      direccionContacto: direccionContacto,
      localidadContacto: localidadContacto,
      provinciaContacto: provinciaContacto,
      telefonoContacto: telefonoContacto,
      observacionesContacto: observacionesContacto,
      correoContacto: correoContacto,
      modoCaptacion: modoCaptacion,
    })
      .then((response) => {
        console.log("Datos enviados correctamente:", response);
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });


  return (
    <div className="App">
      <h1>Formulario de contacto</h1>
      <div className="datos">
        <label>ID cliente: <input
          onChange={(event) => {
            setIdCliente(event.target.value);
          }}
          type="text"></input></label>

        <label>Nombre completo del contacto: <input
          onChange={(event) => {
            setNombreContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Dirección del contacto: <input
          onChange={(event) => {
            setDireccionContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Localidad del contacto: <input
          onChange={(event) => {
            setLocalidadContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Provincia del contacto: <input
          onChange={(event) => {
            setProvinciaContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Teléfono de contacto: <input
          onChange={(event) => {
            setTelefonoContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Observaciones del contacto: <input
          onChange={(event) => {
            setObservacionesContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Correo del contacto: <input
          onChange={(event) => {
            setCorreoContacto(event.target.value);
          }}
          type="text"></input>
        </label>

        <label>Modo de captación: <select
          onChange={(event) => {
            setModoCaptacion(event.target.value);
          }}
          value={modoCaptacion}>
          <option value="">Selecciona un modo de captación</option>
          <option value="Captador">Captador</option>
          <option value="Telemarketing">Telemarketing</option>
          <option value="Referido">Referido</option>
          <option value="Propia">Propia</option>
        </select></label>

        <button onClick={add}>Registrar</button>
      </div>
    </div>
  );
}

export default App;
