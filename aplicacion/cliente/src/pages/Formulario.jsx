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
        calleContacto: "",
        numeroVivienda: "",
        localidadContacto: "",
        provinciaContacto: "",
        fechaVisita: "",
        horaVisita: "",
        numeroPersonas: 0,
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
    };

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        // creamos los condicionales
        if (!datosFormulario.idTrabajador) nuevoError.idTrabajador = "Tu ID de trabajador es obligatorio";
        if (!datosFormulario.nombreContacto) nuevoError.nombreContacto = "El nombre es obligatorio";
        if (!datosFormulario.telefonoContacto || !/^\d{9}$/.test(datosFormulario.telefonoContacto)) nuevoError.telefonoContacto = "El teléfono debe tener 9 dígitos";
        if (!datosFormulario.correoContacto || !/\S+@\S+\.\S+/.test(datosFormulario.correoContacto)) nuevoError.correoContacto = "El correo no es válido";
        if (!datosFormulario.calleContacto) nuevoError.calleContacto = "La calle es obligatoria";
        if (!datosFormulario.numeroVivienda) nuevoError.numeroVivienda = "El número de la vivienda es obligatorio";
        if (!datosFormulario.localidadContacto) nuevoError.localidadContacto = "La localidad es obligatoria";
        if (!datosFormulario.provinciaContacto) nuevoError.provinciaContacto = "La provincia es obligatoria";
        if (!datosFormulario.fechaVisita) nuevoError.fechaVisita = "Debes seleccionar la fecha de la visita";
        if (!datosFormulario.horaVisita) nuevoError.horaVisita = "Debes seleccionar la hora de visita";
        if (isNaN(datosFormulario.numeroPersonas) || datosFormulario.numeroPersonas < 0) nuevoError.numeroPersonas = "El número de personas debe ser un número positivo";
        if (isNaN(datosFormulario.importeLuz) || datosFormulario.importeLuz < 0) nuevoError.importeLuz = "El importe debe ser un número positivo";
        if (isNaN(datosFormulario.importeGas) || datosFormulario.importeGas < 0) nuevoError.importeGas = "El importe debe ser un número positivo";

        setErrores(nuevoError);
        // si hay errores devolvemos true
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
                        // Si el servidor responde con un error
                        console.error("Error al enviar los datos:", error.response.data);
                        // Actualizar los errores con la respuesta del servidor (debería contener el mensaje de error)
                        setErrores({ serverError: error.response.data.error });
                    } else {
                        // Si hubo un error con la solicitud
                        console.error("Error en la solicitud:", error);
                        setErrores({ serverError: "Hubo un problema con la solicitud. Intenta nuevamente." });
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
                        placeholder="Introduce tu ID de trabajador"
                    />
                    {errores.idTrabajador && <label className="error">{errores.idTrabajador}</label>}

                    <label className='nombreCampo'>Nombre completo del contacto:</label>
                    <input
                        className='campoTexto'
                        name='nombreContacto'
                        value={datosFormulario.nombreContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Introduce el nombre completo del contacto"
                    />
                    {errores.nombreContacto && <label className="error">{errores.nombreContacto}</label>}

                    <label className='nombreCampo'>Calle del contacto:</label>
                    <input
                        className='campoTexto'
                        name='calleContacto'
                        value={datosFormulario.calleContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Introduce la calle del contacto"
                    />
                    {errores.calleContacto && <label className="error">{errores.calleContacto}</label>}

                    <label className='nombreCampo'>Número de la vivienda:</label>
                    <input
                        className='campoTexto'
                        name='numeroVivienda'
                        value={datosFormulario.numeroVivienda}
                        onChange={handleChange}
                        type="text"
                        placeholder="Introduce el número de la vivienda"
                    />
                    {errores.numeroVivienda && <label className="error">{errores.numeroVivienda}</label>}

                    <label className='nombreCampo'>Localidad del contacto:</label>
                    <input
                        className='campoTexto'
                        name='localidadContacto'
                        value={datosFormulario.localidadContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Introduce la localidad del contacto"
                    />
                    {errores.localidadContacto && <label className="error">{errores.localidadContacto}</label>}

                    <label className='nombreCampo'>Provincia del contacto:</label>
                    <input
                        className='campoTexto'
                        name='provinciaContacto'
                        value={datosFormulario.provinciaContacto}
                        onChange={handleChange}
                        type="text"
                        placeholder="Introduce la provincia del contacto"
                    />
                    {errores.provinciaContacto && <label className="error">{errores.provinciaContacto}</label>}

                    <label className='nombreCampo'>Teléfono de contacto:</label>
                    <input
                        className='campoTexto'
                        name='telefonoContacto'
                        value={datosFormulario.telefonoContacto}
                        onChange={handleChange}
                        type="tel"
                        placeholder="Introduce el teléfono del contacto"
                    />
                    {errores.telefonoContacto && <label className="error">{errores.telefonoContacto}</label>}

                    <label className='nombreCampo'>Correo del contacto:</label>
                    <input
                        className='campoTexto'
                        name='correoContacto'
                        value={datosFormulario.correoContacto}
                        onChange={handleChange}
                        type="email"
                        placeholder="Introduce el correo electrónico del contacto"
                    />
                    {errores.correoContacto && <label className="error">{errores.correoContacto}</label>}

                    <label className='nombreCampo'>Fecha de la visita:</label>
                    <input
                        className='campoTexto'
                        name='fechaVisita'
                        value={datosFormulario.fechaVisita}
                        onChange={handleChange}
                        type="date"
                        placeholder="Introduce la fecha de la visita"
                    />
                    {errores.fechaVisita && <label className="error">{errores.fechaVisita}</label>}

                    <label className='nombreCampo'>Hora de la visita:</label>
                    <input
                        className='campoTexto'
                        name='horaVisita'
                        value={datosFormulario.horaVisita}
                        onChange={handleChange}
                        type="time"
                        placeholder="Introduce la hora de la visita"
                    />
                    {errores.horaVisita && <label className="error">{errores.horaVisita}</label>}

                    <label className='nombreCampo'>Número de personas en la vivienda:</label>
                    <input
                        className='campoTexto'
                        name='numeroPersonas'
                        value={datosFormulario.numeroPersonas}
                        onChange={handleChange}
                        type="number"
                        placeholder="Introduce el número de residentes"
                    />
                    {errores.numeroPersonas && <label className="error">{errores.numeroPersonas}</label>}

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