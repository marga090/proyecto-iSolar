// importamos el css
import '../styles/Feedback.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";
// importamos el componente EnradaTexto y EntradaSelect
import { EntradaTexto, EntradaSelect } from '../components/CamposFormulario';

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
					{errores.serverError && <div className="errorServidor">
						{errores.serverError}</div>}

					<EntradaTexto label="ID Trabajador" name="idTrabajador" value={datosFeedback.idTrabajador} onChange={handleChange} type="text" placeholder="Ej: 1" error={errores.idTrabajador} />

					<EntradaSelect label="Modo de captación" name="modoCaptacion" value={datosFeedback.modoCaptacion} onChange={handleChange} error={errores.modoCaptacion} options={[
						{ value: "Captador", label: "Captador" },
						{ value: "Telemarketing", label: "Telemarketing" },
						{ value: "Referido", label: "Referido" },
						{ value: "Propia", label: "Captación propia" }
					]} />

					<EntradaSelect label="Resultado de la visita" name="resultadoVisita" value={datosFeedback.resultadoVisita} onChange={handleChange} error={errores.resultadoVisita} options={[
						{ value: "VisitadoPdteCont", label: "Visitado pendiente de contestación" },
						{ value: "VisitadoNada", label: "Visitado pero no hacen nada" },
						{ value: "Recitar", label: "Volver a citar" },
						{ value: "NoVisita", label: "No ha habido visita" },
						{ value: "FirmadaNoFinan", label: "Firmada y no financiable" },
						{ value: "Venta", label: "Venta" }
					]} />

					<EntradaSelect label="Tipo de la visita" name="tipoVisita" value={datosFeedback.tipoVisita} onChange={handleChange} error={errores.tipoVisita} options={[
						{ value: "Corta", label: "Visita de 1 hora (Corta)" },
						{ value: "Media", label: "Visita de 2 horas (Media)" },
						{ value: "Larga", label: "Visita de 3 horas (Larga)" }
					]} />

					<button type="submit">Registrar</button>
				</form>
			</div>
		</div>
	)
} 