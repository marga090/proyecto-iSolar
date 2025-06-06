import '../styles/Formularios.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from '../axiosConfig';
import Swal from 'sweetalert2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Form as BootstrapForm } from 'react-bootstrap';
import CamposFormulario from '../components/CamposFormulario';
import useDocumentTitle from '../components/Titulo';
import dayjs from 'dayjs';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';

export default function ModificarVenta() {
    useDocumentTitle("Modificación de Ventas");

    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerVenta = async () => {
            try {
                const { data } = await Axios.get(`/ventas/${id}`);
                setVenta(data);
            } catch {
            } finally {
                setCargando(false);
            }
        };
        obtenerVenta();
    }, [id]);

    const initialValues = useMemo(() => ({
        idTrabajador: venta?.id_trabajador || "",
        idCliente: venta?.id_cliente || "",
        fechaFirma: venta ? dayjs(venta.fecha_firma).format("YYYY-MM-DD") : "",
        formaPago: venta?.forma_pago || "",
        certificadoEnergetico: venta?.certificado_energetico || "",
        gestionSubvencion: venta?.gestion_subvencion || "",
        gestionLegalizacion: venta?.gestion_legalizacion || "",
        fechaLegalizacion: venta?.fecha_legalizacion ? dayjs(venta.fecha_legalizacion).format("YYYY-MM-DD") : "",
        estado: venta?.estado || ""
    }), [venta]);

    const validationSchema = Yup.object({
        idTrabajador: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        idCliente: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        fechaFirma: Yup.date().required("Este campo es obligatorio"),
        formaPago: Yup.string().required("Este campo es obligatorio"),
        certificadoEnergetico: Yup.string().required("Este campo es obligatorio"),
        gestionSubvencion: Yup.string().required("Este campo es obligatorio"),
        gestionLegalizacion: Yup.string().required("Este campo es obligatorio"),
        fechaLegalizacion: Yup.date().when("gestionLegalizacion", {
            is: "si",
            then: schema => schema.required("Este campo es obligatorio")
        }),
        estado: Yup.string().required("Este campo es obligatorio"),
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            const datos = {
                ...values,
                fechaLegalizacion: values.gestionLegalizacion === 'si' ? values.fechaLegalizacion : null
            };
            await Axios.put(`/ventas/${id}`, datos);
            Swal.fire({ icon: "success", title: "Venta modificada correctamente" })
                .then(() => navigate("/coordinadores/ventas"));
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [id, navigate]);

    const onDelete = useCallback(async () => {
        try {
            const confirmDelete = await Swal.fire({
                title: "¿Estás seguro de que deseas eliminar esta venta?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmDelete.isConfirmed) {
                await Axios.delete(`/ventas/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Venta eliminada correctamente",
                    confirmButtonText: "OK",
                }).then(() => navigate("/coordinadores/ventas"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    if (cargando) {
        return <p className="text-center">Cargando datos de la venta...</p>;
    }

    if (!venta) {
        return <p className="text-center">No se encontró la venta.</p>;
    }

    return (
        <Container className="venta">
            <h1 className="text-center mb-4">Modificación de Ventas</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded bg-light">
                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nuevo ID del trabajador *"
                                    name="idTrabajador"
                                    type="number"
                                    tooltip="Introduce el nuevo id de trabajador"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nuevo ID del cliente *"
                                    name="idCliente"
                                    type="number"
                                    tooltip="Introduce el nuevo id de cliente"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nueva fecha de firma *"
                                    name="fechaFirma"
                                    type="date"
                                    tooltip="Introduce la nueva fecha de firma"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nueva forma de pago *"
                                    name="formaPago"
                                    as="select"
                                    tooltip="Selecciona la nueva forma de pago"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="financiado">Financiado</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="efectivo">Efectivo</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nuevo certificado energético *"
                                    name="certificadoEnergetico"
                                    as="select"
                                    tooltip="Selecciona el nuevo certificado energético"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="en_cuotas">En cuotas</option>
                                    <option value="no">No</option>
                                    <option value="por_transferencia">Por transferencia</option>
                                </CamposFormulario>
                            </Col>
                            <Col md={6}>
                                <CamposFormulario
                                    label="¿Gestión de subvención? *"
                                    name="gestionSubvencion"
                                    as="select"
                                    tooltip="Selecciona si existe gestión de subvención"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario
                                    label="¿Gestión de legalización? *"
                                    name="gestionLegalizacion"
                                    as="select"
                                    tooltip="Selecciona si existe gestión de legalización"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </CamposFormulario>
                            </Col>
                            <Col md={6}>
                                <CamposFormulario
                                    label="Nueva fecha de legalización *"
                                    name="fechaLegalizacion"
                                    type="date"
                                    tooltip="Introduce la nueva fecha de legalización"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <CamposFormulario
                                    label="Nuevo estado de la venta *"
                                    name="estado"
                                    as="select"
                                    tooltip="Selecciona el nuevo estado de la venta"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="instalada">Instalada</option>
                                    <option value="caida">Caída</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center gap-5 mt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? "Modificando..." : "⚠️ Modificar"}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={onDelete}
                            >
                                ❌ Eliminar
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
