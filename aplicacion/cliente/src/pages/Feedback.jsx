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
	const datosInicialesFeedback = {
		idTrabajador: 0,
		idVivienda: 0,
		fechaVisita: "",
		horaVisita: "",
		modoCaptacion: "",
		resultadoVisita: "",
		tipoVisita: ""
	};

	// creamos las constantes para obtener los valores de los campos del feedback
	const [datosFeedback, setDatosFeedback] = useState(datosInicialesFeedback);

	// creamos las constantes para los errores
	const [errores, setErrores] = useState({});

	// validaciones de los campos
	const validaciones = {
		idTrabajador: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
		idVivienda: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
		fechaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		horaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		modoCaptacion: (valor) => !valor ? "Este campo es obligatorio" : null,
		resultadoVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		tipoVisita: (valor) => !valor ? "Este campo es obligatorio	" : null
	};

	// validamos los campos individualmente
	const validarCampo = (campo, valor) => {
		const error = validaciones[campo]?.(valor);
		setErrores(prevState => ({
			...prevState,
			[campo]: error
		}));
	};

	// manejamos los cambios en los campos del formulario
	const handleChange = (e) => {
		const { name, value } = e.target;
		// actualizamos solo las propiedades que han cambiado
		setDatosFeedback(prevState => ({
			...prevState,
			[name]: value
		}));
		validarCampo(name, value);
	};

	// validamos los campos
	const validar = () => {
		const nuevoError = {};
		Object.keys(validaciones).forEach(campo => {
			const error = validaciones[campo](datosFeedback[campo]);
			if (error) nuevoError[campo] = error;
		});
		setErrores(nuevoError);

		// si no hay errores devolvemos true
		return Object.keys(nuevoError).length === 0;
	};


	// metodo para crear clientes
	const addFeedback = (e) => {
		e.preventDefault();
		if (validar()) {
			// llamamos al metodo crear y al cuerpo de la solicitud
			Axios.post("http://localhost:3001/registrarFeedback", datosFeedback)
				.then((response) => {
					console.log("Datos enviados al servidor correctamente:", response);
					setErrores({});
					alert("Feedback registrado correctamente");

					// vaciamos los campos del feedback despues de que se inserten
					setDatosFeedback(datosInicialesFeedback);
				})
				.catch((error) => {
					if (error.response) {
						const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";
						setErrores(prevState => ({
							...prevState,
							serverError: mensajeError
						}));
						console.error("Error en la solicitud:", mensajeError);
					}
				});
		}
	};

	// este es el html visivle en la web
	return (
		<div className='feedback'>
			<h1>Feedback de la visita</h1>

			<div className='contenedorFeedback'>
				<form onSubmit={addFeedback} className='campos'>
					{errores.serverError && <div className="errorServidor">
						{errores.serverError}</div>}

					<EntradaTexto label="ID Trabajador" name="idTrabajador" value={datosFeedback.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

					<EntradaTexto label="ID Vivienda" name="idVivienda" value={datosFeedback.idVivienda} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idVivienda} />

					<EntradaTexto label="Fecha de la visita" name="fechaVisita" value={datosFeedback.fechaVisita} onChange={handleChange} type="date" error={errores.fechaVisita} />

					<EntradaTexto label="Hora de la visita" name="horaVisita" value={datosFeedback.horaVisita} onChange={handleChange} type="time" error={errores.horaVisita} />

					<EntradaSelect label="Modo de captación" name="modoCaptacion" value={datosFeedback.modoCaptacion} onChange={handleChange} error={errores.modoCaptacion} options={[
						{ value: "Captador", label: "Captador" },
						{ value: "Telemarketing", label: "Telemarketing" },
						{ value: "Referido", label: "Referido" },
						{ value: "Propia", label: "Captación propia" }
					]} />

					<EntradaSelect label="Resultado de la visita" name="resultadoVisita" value={datosFeedback.resultadoVisita} onChange={handleChange} error={errores.resultadoVisita} options={[
						{ value: "Visitado_pdte_contestación", label: "Visitado pendiente de contestación" },
						{ value: "Visitado_no_hacen_nada", label: "Visitado pero no hacen nada" },
						{ value: "Recitar", label: "Volver a citar" },
						{ value: "No_visita", label: "No ha habido visita" },
						{ value: "Firmada_no_financiable", label: "Firmada y no financiable" },
						{ value: "Venta", label: "Venta" }
					]} />

					<EntradaSelect label="Tipo de la visita" name="tipoVisita" value={datosFeedback.tipoVisita} onChange={handleChange} error={errores.tipoVisita} options={[
						{ value: "Corta", label: "Visita de 1 hora (Corta)" },
						{ value: "Media", label: "Visita de 2 horas (Media)" },
						{ value: "Larga", label: "Visita de 3 horas (Larga)" }
					]} />

					<button type="submit">Registrar Feedback</button>
				</form>
			</div>
		</div>
	)
} 