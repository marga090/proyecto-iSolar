//importamos el css
import './styles/Formulario.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";
// importamos el componente EnradaTexto y EntradaRadio
import { EntradaTexto, EntradaRadio } from '../components/CamposFormulario';

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

                    <EntradaTexto label="ID Trabajador" name="idTrabajador" value={datosFormulario.idTrabajador} onChange={handleChange} type="text" placeholder="Ej: 1" error={errores.idTrabajador} />

                    <EntradaTexto label="Nombre completo del contacto" name="nombreContacto" value={datosFormulario.nombreContacto} onChange={handleChange} type="text" placeholder="Ej: Gabriel Martín Ruiz" error={errores.nombreContacto} />

                    <EntradaTexto label="Dirección del contacto" name="direccionContacto" value={datosFormulario.direccionContacto} onChange={handleChange} type="text" placeholder="Ej: Calle del Sol, 42" error={errores.direccionContacto} />

                    <EntradaTexto label="Localidad del contacto" name="localidadContacto" value={datosFormulario.localidadContacto} onChange={handleChange} type="text" placeholder="Ej: Mairena de Alcor" error={errores.localidadContacto} />

                    <EntradaTexto label="Provincia del contacto" name="provinciaContacto" value={datosFormulario.provinciaContacto} onChange={handleChange} type="text" placeholder="Ej: Sevilla" error={errores.provinciaContacto} />

                    <EntradaTexto label="Teléfono de contacto" name="telefonoContacto" value={datosFormulario.telefonoContacto} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefonoContacto} />

                    <EntradaTexto label="Correo del contacto" name="correoContacto" value={datosFormulario.correoContacto} onChange={handleChange} type="email" placeholder="Ej: ejemplo@gmail.com" error={errores.correoContacto} />

                    <EntradaTexto label="Fecha de la visita" name="fechaVisita" value={datosFormulario.fechaVisita} onChange={handleChange} type="date" placeholder="Ej: 17/01/2025" error={errores.fechaVisita} />

                    <EntradaTexto label="Hora de la visita" name="horaVisita" value={datosFormulario.horaVisita} onChange={handleChange} type="time" placeholder="Ej: 10:22" error={errores.horaVisita} />

                    <EntradaTexto label="Número de personas en la vivienda" name="numeroPersonas" value={datosFormulario.numeroPersonas} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.numeroPersonas} />

                    <EntradaTexto label="Número de decisores" name="numeroDecisores" value={datosFormulario.numeroDecisores} onChange={handleChange} type="number" placeholder="Ej: 2" error={errores.numeroDecisores} />

                    <EntradaRadio label="¿Tiene bombona?" name="tieneBombona" options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Sin datos", label: "Sin datos" }]}
                        value={datosFormulario.tieneBombona} onChange={handleChange}
                        error={errores.tieneBombona}
                    />

                    <EntradaRadio label="¿Tiene gas?" name="tieneGas" options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Sin datos", label: "Sin datos" }]}
                        value={datosFormulario.tieneGas} onChange={handleChange}
                        error={errores.tieneGas}
                    />

                    <EntradaRadio label="¿Tiene termo eléctrico?" name="tieneTermoElectrico" options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Sin datos", label: "Sin datos" }]}
                        value={datosFormulario.tieneTermoElectrico} onChange={handleChange}
                        error={errores.tieneTermoElectrico}
                    />

                    <EntradaRadio label="¿Tiene placas térmicas?" name="tienePlacasTermicas" options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Sin datos", label: "Sin datos" }]}
                        value={datosFormulario.tienePlacasTermicas} onChange={handleChange}
                        error={errores.tienePlacasTermicas}
                    />

                    <EntradaTexto label="Importe de recibo de luz" name="importeLuz" value={datosFormulario.importeLuz} onChange={handleChange} type="number" step="0.01" placeholder="Ej: 45,50" error={errores.importeLuz} />

                    <EntradaTexto label="Importe de recibo de gas" name="importeGas" value={datosFormulario.importeGas} onChange={handleChange} type="number" step="0.01" placeholder="Ej: 30,00" error={errores.importeGas} />

                    <EntradaTexto label="Observaciones del contacto" name="observacionesContacto" value={datosFormulario.observacionesContacto} onChange={handleChange} type="text" placeholder="Comenta alguna observación" />

                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
}