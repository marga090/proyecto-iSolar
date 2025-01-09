//importamos el css
import './styles/Formulario.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Formulario() {
    // creamos las constantes para obtener los valores de los campos del formulario
    // tabla trabajador
    const [idTrabajador, setIdTrabajador] = useState(0);

    // tabla cliente
    const [nombreContacto, setNombreContacto] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [correoContacto, setCorreoContacto] = useState("");
    const [observacionesContacto, setObservacionesContacto] = useState("");

    // tabla direccion
    const [calleContacto, setCalleContacto] = useState("");
    const [numeroVivienda, setNumeroVivienda] = useState("");
    const [localidadContacto, setLocalidadContacto] = useState("");
    const [provinciaContacto, setProvinciaContacto] = useState("");

    // tabla visita
    const [fechaVisita, setFechaVisita] = useState("");
    const [horaVisita, setHoraVisita] = useState("");

    // tabla vivienda
    const [numeroPersonas, setNumeroPersonas] = useState(0);
    const [tieneBombona, setTieneBombona] = useState("Sin datos");
    const [tieneGas, setTieneGas] = useState("Sin datos");
    const [tieneTermoElectrico, setTieneTermoElectrico] = useState("Sin datos");
    const [tienePlacasTermicas, setTienePlacasTermicas] = useState("Sin datos");

    // tabla recibo
    const [reciboLuz, setReciboLuz] = useState(0);
    const [reciboGas, setReciboGas] = useState(0);

    // errores
    const [errores, setErrores] = useState({
        nombreContacto: "",
        telefonoContacto: "",
        correoContacto: "",
        calleContacto: "",
        numeroVivienda: "",
        localidadContacto: "",
        provinciaContacto: "",
        fechaVisita: "",
        horaVisita: "",
        numeroPersonas: "",
        reciboLuz: "",
        reciboGas: "",
    });

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        // creamos los condicionales
        if (!idTrabajador) nuevoError.idTrabajador = "Tu ID de trabajador es obligatorio";
        if (!nombreContacto) nuevoError.nombreContacto = "El nombre es obligatorio";
        if (!telefonoContacto || !/^\d{9}$/.test(telefonoContacto)) nuevoError.telefonoContacto = "El teléfono debe tener 9 dígitos";
        if (!correoContacto || !/\S+@\S+\.\S+/.test(correoContacto)) nuevoError.correoContacto = "El correo no es válido";
        if (!calleContacto) nuevoError.calleContacto = "La calle es obligatoria";
        if (!numeroVivienda) nuevoError.numeroVivienda = "El número de la vivienda es obligatorio";
        if (!localidadContacto) nuevoError.localidadContacto = "La localidad es obligatoria";
        if (!provinciaContacto) nuevoError.provinciaContacto = "La provincia es obligatoria";
        if (!fechaVisita) nuevoError.fechaVisita = "Debes seleccionar la fecha de la visita";
        if (!horaVisita) nuevoError.horaVisita = "Debes seleccionar la hora de visita";
        if (numeroPersonas !== 0 && (isNaN(numeroPersonas) || numeroPersonas < 0)) nuevoError.numeroPersonas = "El número de personas debe ser un número positivo";
        if (reciboLuz !== 0 && (isNaN(reciboLuz) || reciboLuz < 0)) nuevoError.reciboLuz = "El importe del recibo de luz debe ser un número positivo";
        if (reciboGas !== 0 && (isNaN(reciboGas) || reciboGas < 0)) nuevoError.reciboGas = "El importe del recibo de gas debe ser un número positivo";

        setErrores(nuevoError);
        // devolvemos true o false
        return Object.keys(nuevoError).length === 0;
    };

    // metodo para crear clientes
    const add = () => {
        if (validar()) {
            // llamamos al metodo crear
            Axios.post("http://localhost:3001/create", {
                // trabajador
                idTrabajador,
                // cliente
                nombreContacto,
                telefonoContacto,
                correoContacto,
                observacionesContacto,
                // direccion
                calleContacto,
                numeroVivienda,
                localidadContacto,
                provinciaContacto,
                // visita
                fechaVisita,
                horaVisita,
                // vivienda
                numeroPersonas,
                tieneBombona,
                tieneGas,
                tieneTermoElectrico,
                tienePlacasTermicas,
                // recibo
                reciboLuz,
                reciboGas,
            })
                .then((response) => {
                    console.log("Datos enviados correctamente:", response);
                })
                .catch((error) => {
                    console.error("Error al enviar los datos:", error);
                });
        }
    };

    // este es el html visible en la web
    return (
        <div className="formulario">
            <h1>Formulario de Contactos y Visitas</h1>

            <div className="contenedorFormulario">
                <div className="campos">
                    <label className='nombreCampo'>ID Trabajador:</label>
                    <input className='campoTexto'
                        onChange={(event) => setIdTrabajador(event.target.value)}
                        type="text"
                        placeholder="Introduce tu ID de trabajador"
                    />
                    {errores.idTrabajador && <label className="error">{errores.idTrabajador}</label>}

                    <label className='nombreCampo'>Nombre completo del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setNombreContacto(event.target.value)}
                        type="text"
                        placeholder="Introduce el nombre completo del contacto"
                    />
                    {/* si nombreContacto es true, se muestra el siguiente párrafo */}
                    {errores.nombreContacto && <label className="error">{errores.nombreContacto}</label>}

                    <label className='nombreCampo'>Calle del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setCalleContacto(event.target.value)}
                        type="text"
                        placeholder="Introduce la calle del contacto"
                    />
                    {errores.calleContacto && <label className="error">{errores.calleContacto}</label>}


                    <label className='nombreCampo'>Número de la vivienda:</label>
                    <input className='campoTexto'
                        onChange={(event) => setNumeroVivienda(event.target.value)}
                        type="text"
                        placeholder="Introduce el número de la vivienda"
                    />
                    {errores.numeroVivienda && <label className="error">{errores.numeroVivienda}</label>}


                    <label className='nombreCampo'>Localidad del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setLocalidadContacto(event.target.value)}
                        type="text"
                        placeholder="Introduce la localidad del contacto"
                    />
                    {errores.localidadContacto && <label className="error">{errores.localidadContacto}</label>}

                    <label className='nombreCampo'>Provincia del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setProvinciaContacto(event.target.value)}
                        type="text"
                        placeholder="Introduce la provincia del contacto"
                    />
                    {errores.provinciaContacto && <label className="error">{errores.provinciaContacto}</label>}

                    <label className='nombreCampo'>Teléfono de contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setTelefonoContacto(event.target.value)}
                        type="number"
                        placeholder="Introduce el teléfono del contacto"
                    />
                    {errores.telefonoContacto && <label className="error">{errores.telefonoContacto}</label>}


                    <label className='nombreCampo'>Correo del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setCorreoContacto(event.target.value)}
                        type="text"
                        placeholder="Introduce el correo electrónico del contacto"
                    />
                    {errores.correoContacto && <label className="error">{errores.correoContacto}</label>}


                    <label className='nombreCampo'>Fecha de la visita:</label>
                    <input className='campoTexto'
                        onChange={(event) => setFechaVisita(event.target.value)}
                        type="date"
                        placeholder="Introduce la fecha de la visita"
                    />
                    {errores.fechaVisita && <label className="error">{errores.fechaVisita}</label>}


                    <label className='nombreCampo'>Hora de la visita:</label>
                    <input className='campoTexto'
                        onChange={(event) => setHoraVisita(event.target.value)}
                        type="time"
                        placeholder="Introduce la hora de la visita"
                    />
                    {errores.horaVisita && <label className="error">{errores.horaVisita}</label>}


                    <label className='nombreCampo'>Número de personas en la vivienda:</label>
                    <input className='campoTexto'
                        onChange={(event) => setNumeroPersonas(event.target.value)}
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
                                name="tiene_bombona"
                                value="Si"
                                onChange={(event) => setTieneBombona(event.target.value)}
                            />
                            <label htmlFor="tiene_bombona_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_bombona_no"
                                name="tiene_bombona"
                                value="No"
                                onChange={(event) => setTieneBombona(event.target.value)}
                            />
                            <label htmlFor="tiene_bombona_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_bombona_sin_datos"
                                name="tiene_bombona"
                                value="Sin datos"
                                onChange={(event) => setTieneBombona(event.target.value)}
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
                                name="tiene_gas"
                                value="Si"
                                onChange={(event) => setTieneGas(event.target.value)}
                            />
                            <label htmlFor="tiene_gas_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_gas_no"
                                name="tiene_gas"
                                value="No"
                                onChange={(event) => setTieneGas(event.target.value)}
                            />
                            <label htmlFor="tiene_gas_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_gas_sin_datos"
                                name="tiene_gas"
                                value="Sin datos"
                                onChange={(event) => setTieneGas(event.target.value)}
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
                                name="tiene_termo_electrico"
                                value="Si"
                                onChange={(event) => setTieneTermoElectrico(event.target.value)}
                            />
                            <label htmlFor="tiene_termo_electrico_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_termo_electrico_no"
                                name="tiene_termo_electrico"
                                value="No"
                                onChange={(event) => setTieneTermoElectrico(event.target.value)}
                            />
                            <label htmlFor="tiene_termo_electrico_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_termo_electrico_sin_datos"
                                name="tiene_termo_electrico"
                                value="Sin datos"
                                onChange={(event) => setTieneTermoElectrico(event.target.value)}
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
                                name="tiene_placas_termicas"
                                value="Si"
                                onChange={(event) => setTienePlacasTermicas(event.target.value)}
                            />
                            <label htmlFor="tiene_placas_termicas_si">Sí</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_placas_termicas_no"
                                name="tiene_placas_termicas"
                                value="No"
                                onChange={(event) => setTienePlacasTermicas(event.target.value)}
                            />
                            <label htmlFor="tiene_placas_termicas_no">No</label>
                        </div>

                        <div className='opcion'>
                            <input
                                type="radio"
                                id="tiene_placas_termicas_sin_datos"
                                name="tiene_placas_termicas"
                                value="Sin datos"
                                onChange={(event) => setTienePlacasTermicas(event.target.value)}
                            />
                            <label htmlFor="tiene_placas_termicas_sin_datos">Sin datos</label>
                        </div>
                    </div>

                    <label className='nombreCampo'>Importe de recibo de luz:</label>
                    <input className='campoTexto'
                        onChange={(event) => setReciboLuz(event.target.value)}
                        type="number"
                        placeholder="Introduce el importe de luz del contacto"
                    />
                    {errores.reciboLuz && <label className="error">{errores.reciboLuz}</label>}


                    <label className='nombreCampo'>Importe de recibo de gas:</label>
                    <input className='campoTexto'
                        onChange={(event) => setReciboGas(event.target.value)}
                        type="number"
                        placeholder="Introduce el importe de gas del contacto"
                    />
                    {errores.reciboGas && <label className="error">{errores.reciboGas}</label>}


                    <label className='nombreCampo'>Observaciones del contacto:</label>
                    <input className='campoTexto'
                        onChange={(event) => setObservacionesContacto(event.target.value)}
                        type="text"
                        placeholder="Comenta alguna observación"
                    />

                    <button onClick={add}>Registrar</button>
                </div>
            </div>
        </div>
    );
}