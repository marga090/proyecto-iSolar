//importamos el css
import './App.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axio, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

function App() {
  // creamos las constantes para obtener los valores de los campos del furmulario
  // constantes de la tabla clientes
  const [nombreContacto, setNombreContacto] = useState("");
  const [direccionContacto, setDireccionContacto] = useState("");
  const [localidadContacto, setLocalidadContacto] = useState("");
  const [provinciaContacto, setProvinciaContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [observacionesContacto, setObservacionesContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [modoCaptacion, setModoCaptacion] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [reciboLuz, setReciboLuz] = useState("");
  const [recibidoGas, setReciboGas] = useState("");
  const [tieneBombona, setTieneBombona] = useState("");
  const [tieneGas, setTieneGas] = useState("");
  const [tieneTermoElectrico, setTieneTermoElectrico] = useState("");
  const [tienePlacasTermicas, setTienePlacasTermicas] = useState("");

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
      <h1>Formulario de Contactos y Visitas</h1>

      <div className="contenedorFormulario">
        <div className="datosCliente">
          {/* <label>ID Trabajador:</label>
          <input
            onChange={(event) => setIdTrabajador(event.target.value)}
            type="text"
            placeholder="Introduce el ID del trabajador"
          /> */}
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

          <label>Correo del contacto:</label>
          <input
            onChange={(event) => setCorreoContacto(event.target.value)}
            type="text"
            placeholder="Introduce el correo electrónico del cliente"
          />

          {/* <label>Modo de captación:</label>
          <select
            onChange={(event) => setModoCaptacion(event.target.value)}
            value={modoCaptacion}
          >
            <option value="">Selecciona un modo de captación</option>
            <option value="Captador">Captador</option>
            <option value="Telemarketing">Telemarketing</option>
            <option value="Referido">Referido</option>
            <option value="Propia"> Captación propia</option>
          </select> */}

          <label>Fecha de la visita:</label>
          <input
            onChange={(event) => setFechaVisita(event.target.value)}
            type="text"
            placeholder="Introduce la fecha de la visita"
          />

          <label>Hora de la visita:</label>
          <input
            onChange={(event) => setHoraVisita(event.target.value)}
            type="text"
            placeholder="Introduce la hora de la visita"
          />

          <label>Número de personas en la vivienda:</label>
          <input
            onChange={(event) => setNumeroPersonas(event.target.value)}
            type="text"
            placeholder="Introduce el número de personas que habitan den la vivienda"
          />

          <label>Tiene bombona:</label>
          <div>
            <input
              type="radio"
              id="tiene_bombona_si"
              name="tiene_bombona"
              value="Si"
              onChange={(event) => setTieneBombona(event.target.value)}
            />
            <label htmlFor="tiene_bombona_si">Sí</label>
            <input
              type="radio"
              id="tiene_bombona_no"
              name="tiene_bombona"
              value="No"
              onChange={(event) => setTieneBombona(event.target.value)}
            />
            <label htmlFor="tiene_bombona_no">No</label>
          </div>

          <label>Tiene gas:</label>
          <div>
            <input
              type="radio"
              id="tiene_gas_si"
              name="tiene_gas"
              value="Si"
              onChange={(event) => setTieneGas(event.target.value)}
            />
            <label htmlFor="tiene_gas_si">Sí</label>
            <input
              type="radio"
              id="tiene_gas_no"
              name="tiene_gas"
              value="No"
              onChange={(event) => setTieneGas(event.target.value)}
            />
            <label htmlFor="tiene_gas_no">No</label>
          </div>

          <label>Tiene termo eléctrico:</label>
          <div>
            <input
              type="radio"
              id="tiene_termo_electrico_si"
              name="tiene_termo_electrico"
              value="Si"
              onChange={(event) => setTieneTermoElectrico(event.target.value)}
            />
            <label htmlFor="tiene_termo_electrico_si">Sí</label>
            <input
              type="radio"
              id="tiene_termo_electrico_no"
              name="tiene_termo_electrico"
              value="No"
              onChange={(event) => setTieneTermoElectrico(event.target.value)}
            />
            <label htmlFor="tiene_termo_electrico_no">No</label>
          </div>

          <label>Tiene placas térmicas:</label>
          <div>
            <input
              type="radio"
              id="tiene_placas_termicas_si"
              name="tiene_placas_termicas"
              value="Si"
              onChange={(event) => setTienePlacasTermicas(event.target.value)}
            />
            <label htmlFor="tiene_placas_termicas_si">Sí</label>
            <input
              type="radio"
              id="tiene_placas_termicas_no"
              name="tiene_placas_termicas"
              value="No"
              onChange={(event) => setTienePlacasTermicas(event.target.value)}
            />
            <label htmlFor="tiene_placas_termicas_no">No</label>
          </div>


          <label>Importe de recibo de luz:</label>
          <input
            onChange={(event) => setReciboLuz(event.target.value)}
            type="text"
            placeholder="Introduce el importe de recibo de luz del cliente"
          />

          <label>Importe de recibo de gas:</label>
          <input
            onChange={(event) => setReciboGas(event.target.value)}
            type="text"
            placeholder="Introduce el importe de recibo de gas del cliente"
          />

          <label>Observaciones del contacto:</label>
          <input
            onChange={(event) => setObservacionesContacto(event.target.value)}
            type="text"
            placeholder="Introduce observaciones del cliente en el caso de que las haya"
          />

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