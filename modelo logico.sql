-- MODELO LÓGICO DE LA BD
CLIENTE(id_cliente, nombre, direccion, localidad, provincia, telefono, observaciones, correo, modo_captacion)
	PK(id_cliente)

VIVIENDA(id_vivienda, n_personas, bombona, gas, termo_electrico, placas_termicas, id_vivienda)
	PK(id_vivienda)
	FK(id_cliente -> CLIENTE)

RECIBO(id_recibo, importe_luz, importe_gas, id_vivienda)
	PK(id)
	FK(id_vivienda -> VIVIENDA)

TRABAJADOR(id_trabajador, nombre)
	PK(id_trabajador)

CAPTADOR (id_trabajador)
	PK (id_trabajador)
	FK (id_trabajador -> TRABAJADOR)

COMERCIAL (id_trabajador)
	PK (id_trabajador)
	FK (id_trabajador -> TRABAJADOR)

VISITA (id_visita, fecha, hora, tipo, resultado, id_vivienda, id_trabajadors)
	PK(id_visita, id_vivienda, id_comercial)
	FK(id_vivienda -> VIVIENDA)
	FK(id_trabajador -> COMERCIAL)