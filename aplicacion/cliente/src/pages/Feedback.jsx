// importamos el css
import './styles/Feedback.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Feedback() {
	// creamos las constantes para obtener los valores de los campos del formulario
	const [datosFeedback, setDatosFeedback] = useState({
		idTrabajador: 0,
		modoCaptacion: "",
		resultadoVisita: "",
		tipoVisita: ""
	});

	const [errores, setErrores] = useState({});

	// manejamos los cambios en los campos del formulario
	const handleChange = (e) => {
		const { name, value } = e.target;
		// actualizamos solo las propiedades que han cambiado
		setDatosFeedback(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	// validamos los campos
	const validar = () => {
		const nuevoError = {};
		// creamos los condicionales
		if (!datosFeedback.idTrabajador) nuevoError.idTrabajador = "Tu ID de trabajador es obligatorio";

		setErrores(nuevoError);
		// si hay errores devolvemos true
		return Object.keys(nuevoError).length === 0;
	};

	// metodo para crear clientes
	const add = (e) => {
		e.preventDefault();
		if (validar()) {
			// llamamos al metodo crear y al cuerpo de la solicitud
			Axios.post("http://localhost:3001/create", datosFeedback)
				.then((response) => {
					console.log("Datos enviados al servidor correctamente:", response);
					setErrores({});
					alert("Datos añadidos correctamente");
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

	// este es el html visivle en la web
	return (
		<div className='feedback'>
			<h1>Feedback de la visita</h1>

			<div className='contenedorFeedback'>
				<form onSubmit={add} className='campos'>
					{errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

					<label className='nombreCampo'>ID Trabajador:</label>
					<input
						className='campoTexto'
						name="idTrabajador"
						value={datosFeedback.idTrabajador}
						onChange={handleChange}
						type="text"
						placeholder="Introduce el ID del trabajador"
					/>
					{errores.idTrabajador && <label className="error">{errores.idTrabajador}</label>}

					<label className='nombreCampo'>Modo de captación:</label>
					<select
						name='modoCaptacion'
						onChange={handleChange}
						value={datosFeedback.modoCaptacion}
					>
						<option value="">Selecciona un modo de captación</option>
						<option value="Captador">Captador</option>
						<option value="Telemarketing">Telemarketing</option>
						<option value="Referido">Referido</option>
						<option value="Propia"> Captación propia</option>
					</select>

					<label className='nombreCampo'>Resultado de la visita:</label>
					<select
						name='resultadoVisita'
						onChange={handleChange}
						value={datosFeedback.resultadoVisita}
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
						name='tipoVisita'
						onChange={handleChange}
						value={datosFeedback.resultadoVisita}
					>
						<option value="">Selecciona el tipo de la visita</option>
						<option value="Corta">Visita de 1 hora (Corta)</option>
						<option value="Media">Visita de 2 horas (Media)</option>
						<option value="Larga">Visita de 3 horas (Larga)</option>
					</select>

					<button type="submit">Registrar</button>
				</form>
			</div>
		</div>
	)
} 