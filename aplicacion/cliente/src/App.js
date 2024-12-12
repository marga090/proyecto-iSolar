//importamos el css
import './App.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axio, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

function App() {
  // creamos las constantes para obtener los valores de los campos del furmulario
  const [nombreContacto, setNombreContacto] = useState("");
  const [direccionContacto, setDireccionContacto] = useState("");
  const [localidadContacto, setLocalidadContacto] = useState("");
  const [provinciaContacto, setProvinciaContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [observacionesContacto, setObservacionesContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [modoCaptacion, setModoCaptacion] = useState("");
  // creamos una lista de clientes
  const [listaClientes, setClientes] = useState([]);

  // metodo para crear clientes
  const add = () =>
    // llamamos al metodo crear
    Axios.post("http://localhost:3001/create", {
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

  // metodo para obtener clientes
  const getClientes = () =>
    // llamamos a clientes
    Axios.get("http://localhost:3001/clientes")
      // cuando obtenga la respuesta lo guarde en una variable
      .then((response) => {
        // vienen todos los datos de clientes de la aplicacion
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al mostrar los datos:", error);
      }
      );

  // este es el html visible en la web
  return (
    <div className="App">
      <h1>Formulario de contacto</h1>

      <div className="contenedorFormulario">
        <div className="datosCliente">
          <label>Nombre completo del contacto:</label>
          <input
            onChange={(event) => setNombreContacto(event.target.value)}
            type="text"
            placeholder="Introduce el nombre completo del cliente"
          />

          <label>Dirección del contacto:</label>
          <input
            onChange={(event) => setDireccionContacto(event.target.value)}
            type="text"
            placeholder="Introduce la dirección del cliente"
          />

          <label>Localidad del contacto:</label>
          <input
            onChange={(event) => setLocalidadContacto(event.target.value)}
            type="text"
            placeholder="Introduce la localidad del cliente"
          />

          <label>Provincia del contacto:</label>
          <input
            onChange={(event) => setProvinciaContacto(event.target.value)}
            type="text"
            placeholder="Introduce la provincia del cliente"
          />

          <label>Teléfono de contacto:</label>
          <input
            onChange={(event) => setTelefonoContacto(event.target.value)}
            type="text"
            placeholder="Introduce el teléfono del cliente"
          />

          <label>Observaciones del contacto:</label>
          <input
            onChange={(event) => setObservacionesContacto(event.target.value)}
            type="text"
            placeholder="Introduce observaciones del cliente si las hay"
          />

          <label>Correo del contacto:</label>
          <input
            onChange={(event) => setCorreoContacto(event.target.value)}
            type="text"
            placeholder="Introduce el correo electrónico del cliente"
          />

          <label>Modo de captación:</label>
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

          <button onClick={add}>Registrar</button>
        </div>
      </div>

      <div className="listaClientes">
        <button onClick={getClientes}>Listar clientes</button>
        <div className="clientes-list">
          {listaClientes.map((valor) => {
            return <div key={valor.id_cliente} className="cliente-item">{valor.nombre}</div>;
          })}
        </div>
      </div>
    </div>
  );

}

export default App;