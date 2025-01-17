//importamos el css
import './styles/Formulario.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Formulario() {
    // creamos las constantes para obtener los valores de los campos del formulario
    const [datosFormulario, setDatosFormulario] = useState({
        idTrabajador: 0,
        nombreContacto: "",
        telefonoContacto: "",
        correoContacto: "",
        observacionesContacto: "",
        direccionContacto: "",
        localidadContacto: "",
        provinciaContacto: "",
        fechaVisita: "",
        horaVisita: "",
        numeroPersonas: 0,
        numeroDecisores: 0,
        tieneBombona: "Sin datos",
        tieneGas: "Sin datos",
        tieneTermoElectrico: "Sin datos",
        tienePlacasTermicas: "Sin datos",
        importeLuz: 0,
        importeGas: 0
    });

    const [errores, setErrores] = useState({});

    // manejamos los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // actualizamos solo las propiedades que han cambiado
        setDatosFormulario(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // validamos los campos individualmente
    const validarCampo = (campo, valor) => {
        const nuevoError = { ...errores };  // Copiamos los errores actuales
        switch (campo) {
            case "idTrabajador":
                if (!valor) nuevoError.idTrabajador = "Tu ID de trabajador es obligatorio";
                if (valor <= 0) nuevoError.idTrabajador = "El ID debe ser mayor a 0";
                else delete nuevoError.idTrabajador;
                break;
            case "nombreContacto":
                if (!valor) nuevoError.nombreContacto = "El nombre es obligatorio";
                else delete nuevoError.nombreContacto;
                break;
            case "telefonoContacto":
                if (!valor || !/^\d{9}$/.test(valor)) nuevoError.telefonoContacto = "El teléfono debe tener 9 dígitos";
                else delete nuevoError.telefonoContacto;
                break;
            case "correoContacto":
                if (!valor || !/\S+@\S+\.\S+/.test(valor)) nuevoError.correoContacto = "El correo no es válido";
                else delete nuevoError.correoContacto;
                break;
            case "direccionContacto":
                if (!valor) nuevoError.direccionContacto = "La direccion es obligatoria";
                else delete nuevoError.direccionContacto;
                break;
            case "localidadContacto":
                if (!valor) nuevoError.localidadContacto = "La localidad es obligatoria";
                else delete nuevoError.localidadContacto;
                break;
            case "provinciaContacto":
                if (!valor) nuevoError.provinciaContacto = "La provincia es obligatoria";
                else delete nuevoError.provinciaContacto;
                break;
            case "fechaVisita":
                if (!valor) nuevoError.fechaVisita = "Debes seleccionar la fecha de la visita";
                else delete nuevoError.fechaVisita;
                break;
            case "horaVisita":
                if (!valor) nuevoError.horaVisita = "Debes seleccionar la hora de visita";
                else delete nuevoError.horaVisita;
                break;
            case "numeroPersonas":
                if (isNaN(valor) || valor < 0) nuevoError.numeroPersonas = "El número de personas debe ser un número positivo";
                else delete nuevoError.numeroPersonas;
                break;
            case "numeroDecisores":
                if (isNaN(valor) || valor < 0) nuevoError.numeroDecisores = "El número de decisores debe ser un número positivo";
                if (!valor) nuevoError.numeroDecisores = "El número de decisores es obligatorio";
                else delete nuevoError.numeroDecisores;
                break;
            case "importeLuz":
                if (isNaN(valor) || valor < 0) nuevoError.importeLuz = "El importe debe ser un número positivo";
                else delete nuevoError.importeLuz;
                break;
            case "importeGas":
                if (isNaN(valor) || valor < 0) nuevoError.importeGas = "El importe debe ser un número positivo";
                else delete nuevoError.importeGas;
                break;
            default:
                break;
        }
        // actualizamos los errores
        setErrores(nuevoError);
    };

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        // creamos los condicionales
        if (!datosFormulario.idTrabajador) nuevoError.idTrabajador = "Tu ID de trabajador es obligatorio";
        if (!datosFormulario.nombreContacto) nuevoError.nombreContacto = "El nombre es obligatorio";
        if (!datosFormulario.telefonoContacto) nuevoError.telefonoContacto = "El teléfono es obligatorio";
        if (!datosFormulario.correoContacto) nuevoError.correoContacto = "El correo  es obligatorio";
        if (!datosFormulario.direccionContacto) nuevoError.direccionContacto = "La direccion es obligatoria";
        if (!datosFormulario.localidadContacto) nuevoError.localidadContacto = "La localidad es obligatoria";
        if (!datosFormulario.provinciaContacto) nuevoError.provinciaContacto = "La provincia es obligatoria";
        if (!datosFormulario.fechaVisita) nuevoError.fechaVisita = "Debes seleccionar la fecha de la visita";
        if (!datosFormulario.horaVisita) nuevoError.horaVisita = "Debes seleccionar la hora de visita";
        if (!datosFormulario.numeroDecisores) nuevoError.numeroDecisores = "El número de decisores es obligatorio";


        setErrores(nuevoError);

        // si no hay errores devolvemos true
        return Object.keys(nuevoError).length === 0;
    };

    // metodo para crear clientes
    const add = (e) => {
        e.preventDefault();
        if (validar()) {
            // llamamos al metodo crear y al cuerpo de la solicitud
            Axios.post("http://localhost:3001/create", datosFormulario)
                .then((response) => {
                    console.log("Datos enviados al servidor correctamente:", response);
                    setErrores({});
                    alert("Cliente registrado correctamente");
                })
                .catch((error) => {
                    if (error.response) {
                        // si el servidor responde con un error
                        console.error("Error al enviar los datos:", error.response.data);
                        // actualizar los errores con la respuesta del servidor
                        setErrores({ serverError: error.response.data.error });

                        setErrores(prevState => ({
                            ...prevState,
                            serverError: error.response.data.error
                        }));

                    } else {
                        // si hubo un error con la solicitud
                        console.error("Error en la solicitud:", error);
                        setErrores(prevState => ({
                            ...prevState,
                            serverError: "Hubo un problema con la solicitud. Intenta nuevamente."
                        }));
                    }
                });
        }
    };

    // este es el html visible en la web
    return (
        <div className="formulario">
            <h1>Formulario de Contactos y Visitas</h1>

            <div className="contenedorFormulario">
                <form onSubmit={add} className='campos'>
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}
                    <label className='nombreCampo'>ID Trabajador:</label>
                    <input
                        className='campoTexto'
                        name="idTrabajador"
                        value={datosFormulario.idTrabajador}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: 1"
                    />
                    {errores.idTrabajador && <label className="error">{errores.idTrabajador}</label>}

                    <label className='nombreCampo'>Nombre completo del contacto:</label>
                    <input
                        className='campoTexto'
                        name='nombreContacto'
                        value={datosFormulario.nombreContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Gabriel Martín Ruiz"
                    />
                    {errores.nombreContacto && <label className="error">{errores.nombreContacto}</label>}

                    <label className='nombreCampo'>Dirección del contacto:</label>
                    <input
                        className='campoTexto'
                        name='direccionContacto'
                        value={datosFormulario.direccionContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Calle del Sol, 42"
                    />
                    {errores.direccionContacto && <label className="error">{errores.direccionContacto}</label>}

                    <label className='nombreCampo'>Localidad del contacto:</label>
                    <input
                        className='campoTexto'
                        name='localidadContacto'
                        value={datosFormulario.localidadContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Mairena de Alcor"
                    />
                    {errores.localidadContacto && <label className="error">{errores.localidadContacto}</label>}

                    <label className='nombreCampo'>Provincia del contacto:</label>
                    <input
                        className='campoTexto'
                        name='provinciaContacto'
                        value={datosFormulario.provinciaContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Sevilla"
                    />
                    {errores.provinciaContacto && <label className="error">{errores.provinciaContacto}</label>}

                    <label className='nombreCampo'>Teléfono de contacto:</label>
                    <input
                        className='campoTexto'
                        name='telefonoContacto'
                        value={datosFormulario.telefonoContacto}
                        onChange={handleChange}
                        type="tel"
                        placeholder="Ej: 666555444"
                    />
                    {errores.telefonoContacto && <label className="error">{errores.telefonoContacto}</label>}

                    <label className='nombreCampo'>Correo del contacto:</label>
                    <input
                        className='campoTexto'
                        name='correoContacto'
                        value={datosFormulario.correoContacto}
                        onChange={handleChange}
                        type="email"
                        placeholder="Ej: correodeejemplo@gmail.com"
                    />
                    {errores.correoContacto && <label className="error">{errores.correoContacto}</label>}

                    <label className='nombreCampo'>Fecha de la visita:</label>
                    <input
                        className='campoTexto'
                        name='fechaVisita'
                        value={datosFormulario.fechaVisita}
                        onChange={handleChange}
                        type="date"
                        placeholder="Ej: 17/01/2025"
                    />
                    {errores.fechaVisita && <label className="error">{errores.fechaVisita}</label>}

                    <label className='nombreCampo'>Hora de la visita:</label>
                    <input
                        className='campoTexto'
                        name='horaVisita'
                        value={datosFormulario.horaVisita}
                        onChange={handleChange}
                        type="time"
                        placeholder="Ej: 10:22"
                    />
                    {errores.horaVisita && <label className="error">{errores.horaVisita}</label>}

                    <label className='nombreCampo'>Número de personas en la vivienda:</label>
                    <input
                        className='campoTexto'
                        name='numeroPersonas'
                        value={datosFormulario.numeroPersonas}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 4"
                    />
                    {errores.numeroPersonas && <label className="error">{errores.numeroPersonas}</label>}

                    <label className='nombreCampo'>Número de decisores:</label>
                    <input
                        className='campoTexto'
                        name='numeroDecisores'
                        value={datosFormulario.numeroDecisores}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 2"
                    />
                    {errores.numeroDecisores && <label className="error">{errores.numeroDecisores}</label>}

                    <label className='nombreCampo'>¿Tiene bombona?</label>
                    <div className='opciones'>
                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_bombona_si"
                                name="tieneBombona"
                                value="Si"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_bombona_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_bombona_no"
                                name="tieneBombona"
                                value="No"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_bombona_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_bombona_sin_datos"
                                name="tieneBombona"
                                value="Sin datos"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_bombona_sin_datos">Sin datos</label>
                        </div>
                    </div>

                    <label className='nombreCampo'>¿Tiene gas?</label>
                    <div className='opciones'>
                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_gas_si"
                                name="tieneGas"
                                value="Si"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_gas_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_gas_no"
                                name="tieneGas"
                                value="No"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_gas_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_gas_sin_datos"
                                name="tieneGas"
                                value="Sin datos"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_gas_sin_datos">Sin datos</label>
                        </div>
                    </div>

                    <label className='nombreCampo'>¿Tiene termo eléctrico?</label>
                    <div className='opciones'>
                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_termo_electrico_si"
                                name="tieneTermoElectrico"
                                value="Si"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_termo_electrico_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_termo_electrico_no"
                                name="tieneTermoElectrico"
                                value="No"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_termo_electrico_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_termo_electrico_sin_datos"
                                name="tieneTermoElectrico"
                                value="Sin datos"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_termo_electrico_sin_datos">Sin datos</label>
                        </div>
                    </div>

                    <label className='nombreCampo'>¿Tiene placas térmicas?</label>
                    <div className='opciones'>
                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_placas_termicas_si"
                                name="tienePlacasTermicas"
                                value="Si"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_placas_termicas_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_placas_termicas_no"
                                name="tienePlacasTermicas"
                                value="No"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_placas_termicas_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_placas_termicas_sin_datos"
                                name="tienePlacasTermicas"
                                value="Sin datos"
                                onChange={handleChange}
                            />
                            <label htmlFor="tiene_placas_termicas_sin_datos">Sin datos</label>
                        </div>
                    </div>

                    <label className='nombreCampo'>Importe de recibo de luz:</label>
                    <input
                        className='campoTexto'
                        name='importeLuz'
                        value={datosFormulario.importeLuz}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        placeholder="Introduce el importe de luz del contacto"
                    />
                    {errores.importeLuz && <label className="error">{errores.importeLuz}</label>}

                    <label className='nombreCampo'>Importe de recibo de gas:</label>
                    <input
                        className='campoTexto'
                        name='importeGas'
                        value={datosFormulario.importeGas}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        placeholder="Introduce el importe de gas del contacto"
                    />
                    {errores.importeGas && <label className="error">{errores.importeGas}</label>}

                    <label className='nombreCampo'>Observaciones del contacto:</label>
                    <input
                        className='campoTexto'
                        name='observacionesContacto'
                        value={datosFormulario.observacionesContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Comenta alguna observación"
                    />

                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
}