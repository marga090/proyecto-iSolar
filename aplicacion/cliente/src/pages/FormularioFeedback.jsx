import '../styles/Formularios.css';
import { useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { useIdTrabajador } from '../hooks/useIdTrabajador';
import { useAutocompletarCliente } from '../hooks/useAutocompletarCliente';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import LoadingSpinner from '../components/LoadingSpinner';
import CamposFormulario from '../components/CamposFormulario';

export default function FormularioFeedback() {
	useDocumentTitle("Formulario de Feedbacks");

	const navigate = useNavigate();
	const { idTrabajador, isLoading } = useIdTrabajador();
	const { obtenerCliente } = useAutocompletarCliente();

	const initialValues = useMemo(() => ({
		idTrabajador: idTrabajador || '',
		idCliente: '',
		nombre: '',
		telefono: '',
		correo: '',
		direccion: '',
		localidad: '',
		provincia: '',
		fecha: '',
		hora: '',
		numeroPersonas: '',
		numeroDecisores: '',
		tieneBombona: "sin_datos",
		tieneGas: "sin_datos",
		tieneTermo: "sin_datos",
		tienePlacas: "sin_datos",
		importeLuz: '',
		importeGas: '',
		resultado: '',
		oferta: '',
		estructura: 'sin_datos',
		observaciones: '',
	}), [idTrabajador]);

	const validationSchema = Yup.object({
		idCliente: Yup.number().integer().required('Este campo es obligatorio').min(1, 'El ID no es válido'),
		fecha: Yup.string().required('Este campo es obligatorio'),
		hora: Yup.string().required('Este campo es obligatorio'),
		numeroPersonas: Yup.number().min(1, 'Debe ser mayor a 0'),
		numeroDecisores: Yup.number().min(1, 'Debe ser mayor a 0').required('Este campo es obligatorio'),
		importeLuz: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
		importeGas: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
		resultado: Yup.string().required('Este campo es obligatorio'),
	});

	const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
		try {
			const { data } = await Axios.post("/feedbacks", values);
			if (values.resultado === "venta") {
				await Axios.post("/ventas", {
					idCliente: values.idCliente,
					idTrabajador: values.idTrabajador,
					fechaFirma: null,
					formaPago: null,
					certificadoEnergetico: null,
					gestionSubvencion: null,
					gestionLegalizacion: null,
					fechaLegalizacion: null,
					estado: "pendiente",
				});
			}
			Swal.fire({
				icon: "success",
				title: `El código del feedback es: ${data.idVisita}`,
				text: "Feedback registrado correctamente",
				confirmButtonText: "OK"
			}).then(() => navigate('/comerciales'));
			resetForm();
		} catch (error) {
			erroresSweetAlert2(error);
		} finally {
			setSubmitting(false);
		}
	}, [navigate]);

	if (isLoading) {
		return <LoadingSpinner message="Cargando formulario..." />;
	}

	return (
		<Container fluid="md" className="feedback">
			<h1 className="text-center mb-4">Registro de Feedbacks</h1>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ errors, touched, isSubmitting, setFieldValue, values, isValid }) => (
					<Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light" noValidate>
						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="ID de Trabajador *"
									name="idTrabajador"
									type="number"
									placeholder="Ej: 5"
									errors={errors}
									touched={touched}
									tooltip="Tu código de trabajador"
									disabled
								/>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>ID del Cliente *</BootstrapForm.Label>
									<Field
										name="idCliente"
										type="number"
										className={`form-control ${errors.idCliente && touched.idCliente ? "is-invalid" : ""}`}
										placeholder="Ej: 2"
										onChange={(e) => {
											const idCliente = e.target.value;
											setFieldValue("idCliente", idCliente);
											obtenerCliente(idCliente, setFieldValue);
										}}
									/>
									<ErrorMessage name="idCliente" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Nombre completo del cliente"
									name="nombre"
									value={values.nombre}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Teléfono del cliente"
									name="telefono"
									value={values.telefono}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Correo del cliente"
									name="correo"
									value={values.correo}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Dirección del cliente"
									name="direccion"
									value={values.direccion}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Localidad del cliente"
									name="localidad"
									value={values.localidad}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Provincia del cliente"
									name="provincia"
									value={values.provincia}
									errors={errors}
									touched={touched}
									disabled
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Fecha de la visita *"
									name="fecha"
									type="date"
									errors={errors}
									touched={touched}
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Hora de la visita *"
									name="hora"
									type="time"
									errors={errors}
									touched={touched}
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Número de personas"
									name="numeroPersonas"
									type="number"
									placeholder="Ej: 4"
									errors={errors}
									touched={touched}
									tooltip="Introduce el número de personas que hay en la vivienda"
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Número de decisores *"
									name="numeroDecisores"
									type="number"
									placeholder="Ej: 2"
									errors={errors}
									touched={touched}
									tooltip="Introduce el número de decisores en la vivienda"
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="¿Tiene bombona?"
									name="tieneBombona"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona si el cliente tiene bombona"
								>
									<option value="sin_datos">Sin datos</option>
									<option value="no">No</option>
									<option value="si">Si</option>
								</CamposFormulario>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="¿Tiene gas?"
									name="tieneGas"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona si el cliente tiene gas"
								>
									<option value="sin_datos">Sin datos</option>
									<option value="no">No</option>
									<option value="si">Si</option>
								</CamposFormulario>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="¿Tiene termo?"
									name="tieneTermo"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona si el cliente tiene termo"
								>
									<option value="sin_datos">Sin datos</option>
									<option value="no">No</option>
									<option value="si">Si</option>
								</CamposFormulario>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="¿Tiene placas?"
									name="tienePlacas"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona si el cliente tiene placas"
								>
									<option value="sin_datos">Sin datos</option>
									<option value="no">No</option>
									<option value="si">Si</option>
								</CamposFormulario>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Importe luz (€)"
									name="importeLuz"
									type="number"
									placeholder="Ej: 30,99"
									errors={errors}
									touched={touched}
									tooltip="Introduce el importe de luz de la última factura del cliente"
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Importe gas (€)"
									name="importeGas"
									type="number"
									placeholder="Ej: 20,99"
									errors={errors}
									touched={touched}
									tooltip="Introduce el importe de gas de la última factura del cliente"
								/>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Oferta"
									name="oferta"
									type="text"
									errors={errors}
									touched={touched}
									tooltip="Introduce la oferta que se le ha ofrecido al cliente"
								/>
							</Col>
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Resultado *"
									name="resultado"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona cuál ha sido el resultado del feedback"
								>
									<option value="">Selecciona una opción</option>
									<option value="firmada_no_financiable">Firmada y no financiable</option>
									<option value="no_visita">No ha habido visita</option>
									<option value="venta">Venta</option>
									<option value="visitado_pdte_contestacion">Visitado pendiente de contestación</option>
									<option value="Visitado_no_hacen_nada">Visitado pero no hacen nada</option>
									<option value="recitar">Volver a citar</option>
								</CamposFormulario>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<CamposFormulario
									label="Estructura de la vivienda"
									name="estructura"
									as="select"
									errors={errors}
									touched={touched}
									tooltip="Selecciona cuál es la estructura de la vivienda"
								>
									<option value="sin_datos">Sin datos</option>
									<option value="bancada">Bancada</option>
									<option value="coplanar">Coplanar</option>
									<option value="doble_triangulo">Doble triángulo</option>
									<option value="pergola">Pérgola</option>
									<option value="sinebloc30">Sinebloc30</option>
									<option value="triangulo">Triángulo</option>
								</CamposFormulario>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12}>
								<CamposFormulario
									label="Observaciones"
									name="observaciones"
									as="textarea"
									rows="3"
									errors={errors}
									touched={touched}
									tooltip="Introducela alguna observación si la hay"
								/>
							</Col>
						</Row>

						<div className="d-flex justify-content-center">
							<Button
								type="submit"
								className="mt-3"
								disabled={isSubmitting || !isValid}
								aria-label="Registrar feedback"
							>
								{isSubmitting ? "Enviando..." : "✅ Registrar"}
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</Container>
	);
}