-- MODELO LÓGICO DE LA BD
TRABAJADOR(id_trabajador, nombre, contrasena, telefono, puesto, departamento, equipo, fecha_alta, fecha_baja)
    PK(id_trabajador)

CLIENTE(id_cliente, nombre, telefono, correo, dni, iban, modo_captacion, observaciones, fecha_alta)
    PK(id_cliente)

DOMICILIO(id_domicilio, direccion, localidad, provincia, id_cliente)
    PK(id_domicilio)
    FK(id_cliente -> CLIENTE)

VIVIENDA(id_vivienda, visitada, numero_personas, numero_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, estructura, id_domicilio)
    PK(id_vivienda)
    FK(id_domicilio -> DOMICILIO)

RECIBO(id_recibo, importe_luz, importe_gas, id_vivienda)
    PK(id_recibo)
    FK(id_vivienda -> VIVIENDA)

VISITA(id_visita, fecha, hora, resultado, oferta, observaciones, fecha_registro, id_vivienda, id_trabajador)
    PK(id_visita)
    FK(id_vivienda -> VIVIENDA)
    FK(id_trabajador -> TRABAJADOR)

VENTA(id_venta, fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado, id_trabajador, id_cliente)
    PK(id_venta)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_cliente -> CLIENTE)

INSTALACION(id_instalacion, fecha, numero_placas, grua, importe_grua, tipo_instalador, terminada, fecha_terminada, otros_costes, observaciones, id_trabajador, id_vivienda, id_venta)
    PK(id_instalacion)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_vivienda -> VIVIENDA)
    FK(id_venta -> VENTA)

AGENDA(id_agenda, titulo, descripcion, fecha_inicio, fecha_fin, estado, fecha_asignacion, id_trabajador, id_vivienda)
    PK(id_agenda)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_vivienda -> VIVIENDA)

AUDITORIA(id, descripcion, fecha, id_trabajador)
    PK(id)
    FK(id_trabajador -> TRABAJADOR)