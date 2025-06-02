-- CREACION DE TABLAS
DROP DATABASE IF EXISTS insene;
CREATE DATABASE insene;
USE insene;

CREATE TABLE trabajador(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono CHAR(9),
    puesto ENUM('administrador', 'administrativo', 'captador', 'ceo', 'comercial', 'coordinador', 'ingeniero', 'instalador', 'limpiador', 'mozo_almacen', 'rrhh', 'tramitador'),
    departamento ENUM('administracion', 'comercial', 'gerencia', 'instalaciones', 'limpieza', 'rrhh'),
    equipo VARCHAR(100) NULL, 
	fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_baja DATETIME
);

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    telefono CHAR(9) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    dni CHAR(9) UNIQUE,
    iban VARCHAR(34),
    modo_captacion ENUM('captador', 'telemarketing', 'referido', 'propia'),
    observaciones VARCHAR(500),
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE domicilio (
	id_domicilio INT PRIMARY KEY AUTO_INCREMENT,
    direccion VARCHAR(100) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    id_cliente INT,
    
    CONSTRAINT fk_domicilio_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE vivienda (
    id_vivienda INT PRIMARY KEY AUTO_INCREMENT,
    numero_personas INT,
    numero_decisores INT,
    tiene_bombona ENUM('no', 'si', 'sin_datos'),
    tiene_gas ENUM('no', 'si', 'sin_datos'),
    tiene_termo_electrico ENUM('no', 'si', 'sin_datos'),
	tiene_placas_termicas ENUM('no', 'si', 'sin_datos'),
    estructura ENUM('bancada', 'coplanar', 'doble_triangulo', 'pergola', 'sin_datos', 'sinebloc30', 'triangulo'),
	id_domicilio INT,
    
    CONSTRAINT fk_vivienda_id_domicilio FOREIGN KEY (id_domicilio) REFERENCES domicilio(id_domicilio) ON DELETE CASCADE
);

CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    fecha_firma DATE,
    forma_pago ENUM('financiado', 'transferencia', 'efectivo') NULL,
    certificado_energetico ENUM('en_cuotas', 'por_transferencia', 'no') NULL,
    gestion_subvencion ENUM('no', 'si') NULL,
    gestion_legalizacion ENUM('no', 'si') NULL,
    fecha_legalizacion DATE,
    estado ENUM('caida', 'instalada', 'pendiente') NOT NULL DEFAULT 'pendiente',
    id_trabajador INT NOT NULL,
    id_cliente INT NOT NULL,
    
    CONSTRAINT fk_venta_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_venta_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE instalacion (
    id_instalacion INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE,
    numero_placas INT NOT NULL,
	grua ENUM ('no', 'si'),
    importe_grua DECIMAL(10,2),
    tipo_instalador ENUM('propio', 'subcontrata') NOT NULL,
    terminada ENUM ('no', 'si') NOT NULL,
    fecha_terminada DATE,
    otros_costes VARCHAR(100),
    observaciones VARCHAR(500),
    id_trabajador INT NOT NULL,
    id_vivienda INT NOT NULL,
    id_venta INT NOT NULL,
    
    CONSTRAINT fk_instalacion_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_instalacion_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_instalacion_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
);

CREATE TABLE visita (
	id_visita INT PRIMARY KEY AUTO_INCREMENT,
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    resultado ENUM ('visitado_pdte_contestacion', 'Visitado_no_hacen_nada', 'recitar', 'no_visita', 'firmada_no_financiable', 'venta'),
    oferta VARCHAR(200),
    observaciones VARCHAR(500),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
	id_vivienda INT,
    id_trabajador INT,
    
    CONSTRAINT fk_visita_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_visita_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);

CREATE TABLE recibo(
	id_recibo INT PRIMARY KEY AUTO_INCREMENT,
    importe_luz DECIMAL(6,2),
	importe_gas DECIMAL(6,2),
    id_vivienda INT,
    
    CONSTRAINT fk_recibo_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

CREATE TABLE agenda (
    id_agenda INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(255),
	descripcion VARCHAR(255),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado ENUM('cancelada', 'completada', 'pendiente') DEFAULT 'pendiente',
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_trabajador INT NOT NULL,
    id_vivienda INT NOT NULL,

    CONSTRAINT fk_agenda_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_agenda_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(255) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_trabajador INT
);

-- INSERTS

INSERT INTO trabajador (nombre, contrasena, telefono, puesto, departamento, equipo) VALUES
('Ángel Domínguez Rodríguez', '$2b$10$1Ckj.oPYuQ65TaeEPHbm/.ul6R6kCYsnmyM1zfqNrrXVaS74zPuWm', '600123456', 'administrador', 'administracion', null),
('Margarita Gandul Pedregal', '$2b$10$CeEelXZmSL0lnsW.IknTmeQ.uBzpOqO/Bryud6xIaPJEQqT4IkD52', '600123457', 'administrador', 'administracion', null),
('Luis Martínez García', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '635987898', 'instalador', 'instalaciones', null),
('Manuel Sánchez Fernández', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123459', 'coordinador', 'comercial', null),
('Marta Rodríguez González', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123460', 'comercial', 'comercial', 'Manuel Sánchez Fernández'),
('Carlos Torres Rodríguez', '$2b$10$5pTr0IZLT/Nclf9GEKsMDOu/SaRvPGbRWB5JGLXsOSHdWdJ0HKFWu', '600123461', 'rrhh', 'rrhh', null),
('Isabel Díaz López', '$2b$10$L0AmyBZQHQ1vU9xZ0rmYNedMKKF.l\xKuC8oWeP6KwLEomjvF1hMO', '600123462', 'tramitador', 'administracion', null),
('José Pérez Martínez', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123463', 'comercial', 'comercial', 'Manuel Sánchez Fernández'),
('Laura López Sánchez', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123464', 'instalador', 'instalaciones', null),
('Javier González', '$2b$10$GC.hWE/pwi7etgEYGqXz7OB77XBJ5WixsvFh5weVqseFiyvD4daRe', '600123465', 'captador', 'comercial', 'Jesús Molina López'),
('Jesús Molina López', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123466', 'coordinador', 'comercial', null),
('Sofía Hernández Pérez', '$2b$10$abCD12345678examplepass1', '600123467', 'administrador', 'administracion', null),
('Andrés Martínez Gómez', '$2b$10$5pTr0IZLT/Nclf9GEKsMDOu/SaRvPGbRWB5JGLXsOSHdWdJ0HKFWu', '600123468', 'rrhh', 'rrhh', null),
('Nuria Gutiérrez Díaz', '$2b$10$abCD12345678examplepass3', '600123469', 'tramitador', 'administracion', null),
('Pablo Ruiz Navarro', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123470', 'instalador', 'instalaciones', null),
('Clara Moreno Moreno', '$2b$10$abCD12345678examplepass5', '600123471', 'comercial', 'comercial', 'Manuel Sánchez Fernández'),
('Hugo Navarro Molina', '$2b$10$abCD12345678examplepass6', '600123472', 'captador', 'comercial', 'Jesús Molina López'),
('Eva Romero Castro', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123473', 'coordinador', 'comercial', null),
('Daniel Ortega Serrano', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123474', 'instalador', 'instalaciones', null),
('Patricia Vega Campos', '$2b$10$abCD12345678examplepass9', '600123475', 'tramitador', 'administracion', null),
('Raúl Torres Montes', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123476', 'comercial', 'comercial', 'Eva Romero Castro');

SELECT * FROM trabajador;

INSERT INTO cliente (nombre, telefono, correo, dni, iban, modo_captacion, observaciones) VALUES
('Juan García Pardo', '600111111', 'juan@gmail.com', '12345678A', 'ES1234567890123456789012', 'captador', 'Cliente reciente'),
('Ana Rodríguez Alegre', '600111112', 'ana@gmail.com', '23456789B', 'ES2234567890123456789012', 'telemarketing', 'Cliente de larga data'),
('Luis Fernández Largo', '600111113', 'luis@gmail.com', '34567890C', 'ES3234567890123456789012', 'referido', 'Interés en productos energéticos'),
('Pedro Jiménez Cortés', '600111114', 'pedro@hotmail.com', '45678901D', 'ES4234567890123456789012', 'propia', 'Consulta inicial'),
('Marta López Calvo', '600111115', 'marta@gmail.com', '56789012E', 'ES5234567890123456789012', 'captador', 'Solicitó información adicional'),
('Carlos Jiménez Delgado', '600111116', 'carlos@gmail.com', '67890123F', 'ES6234567890123456789012', 'telemarketing', 'Cliente en espera'),
('Isabel Martínez Sastre', '600111117', 'isabel@gmail.com', '78901234G', 'ES7234567890123456789012', 'referido', 'Solicitó presupuesto'),
('José Pérez Rubio', '600111118', 'jose@hotmail.com', '89012345H', 'ES8234567890123456789012', 'propia', 'Sin interés por ahora'),
('Laura Gómez Moreno', '600111119', 'laura@hotmail.com', '90123456I', 'ES9234567890123456789012', 'captador', 'Recibió llamada informativa'),
('Raúl López Carpintero', '600111120', 'raul@gmail.com', '01234567J', 'ES0234567890123456789012', 'telemarketing', 'Posible cliente futuro'),
('Sofía Morales Barbero', '600111121', 'sofia@gmail.com', '11223344A', 'ES1034567890123456789012', 'referido', 'Interesada en energía solar'),
('Diego Sánchez Calderón', '600111122', 'diego@hotmail.com', '22334455B', 'ES2034567890123456789012', 'captador', 'Quiere reducir factura de luz'),
('Lucía Torres Ferrer', '600111123', 'lucia@gmail.com', '33445566C', 'ES3034567890123456789012', 'propia', 'Vivienda con buena orientación solar'),
('Daniel Ramírez Pastor', '600111124', 'daniel@gmail.com', '44556677D', 'ES4034567890123456789012', 'telemarketing', 'Solicita visita presencial'),
('Carmen Ruiz Rubio', '600111125', 'carmen@hotmail.com', '55667788E', 'ES5034567890123456789012', 'captador', 'Interesada en placas y baterías'),
('Andrés Molina Rivera', '600111126', 'andres@gmail.com', '66778899F', 'ES6034567890123456789012', 'referido', 'Cliente informado por vecino'),
('Eva Herrera Serrano', '600111127', 'eva@hotmail.com', '77889900G', 'ES7034567890123456789012', 'propia', 'Quiere estudiar viabilidad del proyecto'),
('Alejandro Gil Campos', '600111128', 'alejandro@gmail.com', '88990011H', 'ES8034567890123456789012', 'telemarketing', 'Pidió presupuesto detallado'),
('María Navarro Campos', '600111129', 'maria@gmail.com', '99001122I', 'ES9034567890123456789012', 'captador', 'Solicitud recibida en feria local'),
('Pablo Ortega Moreno', '600111130', 'pablo@hotmail.com', '00112233J', 'ES0134567890123456789012', 'referido', 'Amigo de un cliente satisfecho');

SELECT * FROM cliente;

INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES
('Calle Falsa, 123', 'Aranjuez', 'Madrid', 1),
('Avenida del Sol, 456', 'Sitges', 'Barcelona', 2),
('Calle Real, 789', 'Serra', 'Valencia', 3),
('Calle Luna, 101', 'Mairena del Alcor', 'Sevilla', 4),
('Calle Estrella, 202', 'Tarazona', 'Zaragoza', 5),
('Calle Verde, 303', 'Mula', 'Murcia', 6),
('Calle Azul, 404', 'Bilbao', 'Vizcaya', 7),
('Calle Viento, 505', 'Pampaneira', 'Granada', 8),
('Calle Mar, 606', 'Frigiliana', 'Málaga', 9),
('Calle Río, 707', 'La Alberca', 'Salamanca', 10),
('Calle Nube, 808', 'Baiona', 'Pontevedra', 11),
('Avenida Brisa, 909', 'Luarca', 'Asturias', 12),
('Calle Solana, 1010', 'Olite', 'Navarra', 13),
('Camino del Bosque, 1111', 'Ezcaray', 'La Rioja', 14),
('Calle del Lago, 1212', 'Comillas', 'Cantabria', 15),
('Travesía Norte, 1313', 'Altea', 'Alicante', 16),
('Calle Horizonte, 1414', 'Mojácar', 'Almería', 17),
('Paseo de las Flores, 1515', 'Vejer de la Frontera', 'Cádiz', 18),
('Avenida del Valle, 1616', 'Albarracín', 'Teruel', 19),
('Calle del Mirador, 1717', 'Candelaria', 'Santa Cruz de Tenerife', 20);

SELECT * FROM domicilio;

INSERT INTO vivienda (numero_personas, numero_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, estructura, id_domicilio) VALUES
(3, 2, 'si', 'si', 'si', 'no', 'coplanar', 1),
(4, 3, 'no', 'si', 'no', 'si', 'triangulo', 2),
(2, 1, 'si', 'no', 'si', 'no', 'pergola', 3),
(5, 4, 'no', 'si', 'si', 'si', 'bancada', 4),
(6, 2, 'si', 'no', 'si', 'no', 'doble_triangulo', 5),
(3, 2, 'no', 'si', 'no', 'no', 'sin_datos', 6),
(2, 1, 'si', 'no', 'si', 'si', 'sinebloc30', 7),
(4, 3, 'si', 'si', 'no', 'no', 'coplanar', 8),
(5, 3, 'no', 'no', 'si', 'no', 'triangulo', 9),
(3, 2, 'si', 'si', 'no', 'si', 'pergola', 10),
(4, 2, 'no', 'si', 'si', 'no', 'coplanar', 11),
(3, 1, 'si', 'no', 'no', 'no', 'triangulo', 12),
(2, 2, 'no', 'si', 'si', 'si', 'bancada', 13),
(5, 3, 'si', 'si', 'no', 'no', 'doble_triangulo', 14),
(1, 1, 'no', 'no', 'si', 'no', 'pergola', 15),
(6, 2, 'si', 'si', 'si', 'si', 'sinebloc30', 16),
(3, 2, 'no', 'no', 'no', 'no', 'coplanar', 17),
(4, 3, 'si', 'no', 'si', 'si', 'triangulo', 18),
(2, 1, 'si', 'si', 'no', 'no', 'sin_datos', 19),
(5, 4, 'no', 'si', 'si', 'no', 'bancada', 20);

SELECT * FROM vivienda;

INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES
(50.00, 30.00, 1),
(60.00, 35.00, 2),
(45.00, 28.00, 3),
(55.00, 32.00, 4),
(70.00, 40.00, 5),
(65.00, 38.00, 6),
(72.00, 41.00, 7),
(58.00, 36.00, 8),
(48.00, 31.00, 9),
(62.00, 37.00, 10),
(53.00, 33.00, 11),
(47.50, 29.00, 12),
(61.00, 39.00, 13),
(56.75, 34.50, 14),
(49.00, 27.00, 15),
(73.25, 42.00, 16),
(44.00, 26.00, 17),
(59.50, 37.50, 18),
(46.00, 30.00, 19),
(68.00, 41.50, 20);

SELECT * FROM recibo;

INSERT INTO visita (fecha, hora, resultado, oferta, observaciones, id_vivienda, id_trabajador) VALUES
('2025-02-27', '10:00', 'visitado_pdte_contestacion', 'Solar', 'Cliente interesado en la instalación', 1, 5),
('2025-02-28', '11:00', 'no_visita', 'No disponible', 'No se pudo contactar al cliente', 2, 8),
('2025-03-01', '12:00', 'venta', 'Energía solar fotovoltaica', 'Contrato firmado y pago realizado', 3, 16),
('2025-03-02', '13:00', 'recitar', 'Luz solar y térmica', 'Cliente solicitó más información', 4, 21),
('2025-03-03', '14:00', 'Visitado_no_hacen_nada', 'Eficiencia energética', 'El cliente no mostró interés', 5, 5),
('2025-03-04', '15:00', 'firmada_no_financiable', 'Instalación con financiación', 'Cliente no aceptó la propuesta de financiación', 6, 8),
('2025-03-05', '16:00', 'visitado_pdte_contestacion', 'Placas solares', 'Esperando respuesta del cliente', 7, 16),
('2025-03-06', '17:00', 'venta', 'Energía renovable', 'Venta realizada, instalación programada', 8, 21),
('2025-03-07', '18:00', 'no_visita', 'No disponible', 'El cliente no estaba en casa', 9, 5),
('2025-03-08', '19:00', 'Visitado_no_hacen_nada', 'Sistemas térmicos', 'No hubo interés en la propuesta', 10, 8),
('2025-03-09', '10:30', 'venta', 'Solar + batería', 'Venta cerrada con sistema de almacenamiento', 11, 16),
('2025-03-10', '11:15', 'visitado_pdte_contestacion', 'Fotovoltaica básica', 'Cliente pidió tiempo para pensarlo', 12, 21),
('2025-03-11', '12:45', 'recitar', 'Placas térmicas', 'Solicita presupuesto detallado', 13, 5),
('2025-03-12', '13:30', 'Visitado_no_hacen_nada', 'Autoconsumo', 'Cliente sin interés real', 14, 8),
('2025-03-13', '14:00', 'firmada_no_financiable', 'Pack eficiencia energética', 'Ingreso insuficiente para financiación', 15, 16),
('2025-03-14', '15:20', 'no_visita', 'No disponible', 'Cliente ausente a la hora pactada', 16, 21),
('2025-03-15', '16:45', 'venta', 'Solar completa', 'Firma realizada con instalación urgente', 17, 5),
('2025-03-16', '17:30', 'visitado_pdte_contestacion', 'Kit solar compacto', 'Duda entre dos ofertas', 18, 8),
('2025-03-17', '18:10', 'no_visita', 'No disponible', 'Dirección errónea', 19, 16),
('2025-03-18', '19:00', 'venta', 'Pack solar + térmico', 'Firma realizada sin financiación', 20, 21);

SELECT * FROM visita;

INSERT INTO venta (fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado, id_trabajador, id_cliente) VALUES
('2025-01-15', 'financiado', 'en_cuotas', 'si', 'no', NULL, 'instalada', 5, 1),
('2025-02-18', 'transferencia', 'por_transferencia', 'no', 'no', NULL, 'caida', 8, 2),
('2025-02-20', 'efectivo', 'no', 'si', 'si', '2025-03-01', 'instalada', 17, 3),
('2025-02-22', 'financiado', 'en_cuotas', 'si', 'si', '2025-03-02', 'instalada', 5, 4),
('2025-01-25', 'efectivo', 'no', 'no', 'no', NULL, 'caida', 8, 5),
('2025-02-10', 'transferencia', 'por_transferencia', 'no', 'no', NULL, 'instalada', 17, 6),
('2025-03-05', 'financiado', 'en_cuotas', 'si', 'si', '2025-03-03', 'instalada', 17, 7),
('2025-03-10', 'efectivo', 'no', 'no', 'no', NULL, 'caida', 18, 8),
('2025-03-15', 'transferencia', 'por_transferencia', 'no', 'no', NULL, 'instalada', 5, 9),
('2025-02-28', 'financiado', 'en_cuotas', 'si', 'si', '2025-03-04', 'instalada', 17, 10),
('2025-03-20', 'efectivo', 'no', 'no', 'si', '2025-03-25', 'instalada', 5, 11),
('2025-03-22', 'transferencia', 'por_transferencia', 'si', 'no', NULL, 'instalada', 8, 12),
('2025-03-23', 'financiado', 'en_cuotas', 'si', 'si', '2025-03-30', 'instalada', 17, 13),
('2025-03-24', 'efectivo', 'no', 'no', 'no', NULL, 'caida', 18, 14),
('2025-03-25', 'transferencia', 'por_transferencia', 'no', 'si', '2025-04-01', 'instalada', 5, 15),
('2025-03-26', 'financiado', 'en_cuotas', 'si', 'si', '2025-04-02', 'instalada', 8, 16),
('2025-03-27', 'efectivo', 'no', 'no', 'no', NULL, 'instalada', 17, 17),
('2025-03-28', 'transferencia', 'por_transferencia', 'si', 'no', NULL, 'caida', 18, 18),
('2025-03-29', 'financiado', 'en_cuotas', 'no', 'si', '2025-04-05', 'instalada', 5, 19),
('2025-03-30', 'efectivo', 'no', 'no', 'no', NULL, 'caida', 8, 20),
(NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', 8, 20);

SELECT * FROM venta;

INSERT INTO instalacion ( fecha, numero_placas, grua, importe_grua, tipo_instalador, terminada, fecha_terminada, otros_costes, observaciones, id_trabajador, id_vivienda, id_venta) VALUES
('2025-01-20', 5, 'si', 200.00, 'propio', 'si', '2025-01-21', 'Ninguno', 'Instalación realizada sin problemas', 3, 1, 1),
('2025-02-21', 6, 'no', NULL, 'subcontrata', 'no', NULL, NULL, 'Falta completar', 9, 2, 2),
('2025-02-22', 8, 'si', 150.00, 'propio', 'si', '2025-02-23', 'Costo adicional', 'Placas de mayor capacidad instaladas', 16, 3, 3),
('2025-02-24', 7, 'no', NULL, 'propio', 'si', '2025-02-25', 'Ninguno', 'Instalación terminada con éxito', 20, 4, 4),
('2025-01-27', 10, 'si', 250.00, 'subcontrata', 'no', NULL, 'Costos adicionales en mano de obra', 'Requiere revisión de algunos detalles', 3, 5, 5),
('2025-02-26', 9, 'no', NULL, 'propio', 'si', '2025-02-27', 'Sin otros costes', 'Instalación completa', 9, 6, 6),
('2025-03-01', 5, 'no', NULL, 'subcontrata', 'no', NULL, NULL, 'Incompleta', 16, 7, 7),
('2025-03-02', 4, 'si', 300.00, 'propio', 'si', '2025-03-03', 'Sin costes adicionales', 'Instalación lista para funcionamiento', 20, 8, 8),
('2025-03-05', 6, 'no', NULL, 'subcontrata', 'si', '2025-03-06', 'Sin otros costes', 'Instalación en perfectas condiciones', 3, 9, 9),
('2025-03-07', 3, 'no', NULL, 'propio', 'si', '2025-03-08', 'Ninguno', 'Trabajo finalizado', 9, 10, 10),
('2025-03-10', 7, 'no', NULL, 'propio', 'si', '2025-03-11', 'Ninguno', 'Instalación rápida y sin incidencias', 16, 11, 11),
('2025-03-12', 5, 'si', 220.00, 'subcontrata', 'no', NULL, 'Coste extra por condiciones del terreno', 'Cliente satisfecho con el progreso', 3, 12, 12),
('2025-03-13', 8, 'no', NULL, 'propio', 'si', '2025-03-14', 'Sin costes adicionales', 'Todo conforme al plan', 9, 13, 13),
('2025-03-14', 6, 'si', 180.00, 'subcontrata', 'si', '2025-03-15', 'Costo grúa incluido', 'Instalación completa y certificada', 20, 14, 14),
('2025-03-15', 9, 'no', NULL, 'propio', 'no', NULL, NULL, 'Pendiente revisión final', 16, 15, 15),
('2025-03-16', 4, 'si', 210.00, 'subcontrata', 'si', '2025-03-17', 'Ninguno', 'Buen resultado y cliente contento', 3, 16, 16),
('2025-03-17', 7, 'no', NULL, 'propio', 'si', '2025-03-18', 'Sin costes adicionales', 'Instalación en perfecto estado', 9, 17, 17),
('2025-03-18', 5, 'no', NULL, 'subcontrata', 'no', NULL, 'Problema con el acceso a la vivienda', 'Pendiente resolver', 20, 18, 18),
('2025-03-19', 6, 'si', 190.00, 'propio', 'si', '2025-03-20', 'Costo de grúa justificado', 'Instalación realizada sin contratiempos', 16, 19, 19),
('2025-03-20', 8, 'no', NULL, 'subcontrata', 'si', '2025-03-21', 'Sin otros costes', 'Cliente satisfecho con la instalación', 3, 20, 20);

SELECT * FROM instalacion;

INSERT INTO agenda (titulo, descripcion, fecha_inicio, fecha_fin, id_trabajador, id_vivienda) VALUES 
('Visita a casa 1', 'Primera visita a la vivienda para evaluación inicial', '2025-05-14 10:00:00', '2025-05-14 11:00:00', 5, 1),
('Visita a casa 2', 'Inspección presencial para recopilar datos del proyecto', '2025-05-23 16:00:00', '2025-05-23 17:00:00', 8, 2),
('Visita a casa 3', 'Revisión técnica en el domicilio del cliente', '2025-05-09 09:00:00', '2025-05-09 10:00:00', 16, 3),
('Visita a casa 4', 'Análisis del tejado y orientación para instalación', '2025-05-09 17:00:00', '2025-05-09 18:00:00', 21, 4),
('Visita a casa 5', 'Reunión en domicilio para ver viabilidad de placas', '2025-05-05 11:30:00', '2025-05-05 12:30:00', 5, 5),
('Visita a casa 6', 'Comprobación de espacio disponible para instalación', '2025-05-14 15:00:00', '2025-05-14 16:00:00', 8, 6),
('Visita a casa 7', 'Mediciones en tejado para estructura recomendada', '2025-05-26 10:00:00', '2025-05-26 11:30:00', 16, 7),
('Visita a casa 8', 'Verificación de condiciones de instalación', '2025-05-26 13:00:00', '2025-05-26 14:00:00', 21, 8),
('Visita a casa 9', 'Evaluación de necesidades energéticas en casa', '2025-05-27 09:30:00', '2025-05-27 10:30:00', 5, 9),
('Visita a casa 10', 'Inspección para definir tipo de estructura necesaria', '2025-05-27 12:00:00', '2025-05-27 13:00:00', 8, 10),
('Visita a casa 11', 'Revisión de condiciones de tejado y acceso', '2025-05-28 11:00:00', '2025-05-28 12:00:00', 16, 11),
('Visita a casa 12', 'Confirmación de materiales según el espacio disponible', '2025-05-28 15:00:00', '2025-05-28 16:00:00', 21, 12),
('Visita a casa 13', 'Diagnóstico técnico de vivienda para propuesta solar', '2025-05-29 09:00:00', '2025-05-29 10:30:00', 5, 13),
('Visita a casa 14', 'Análisis de consumo energético en el hogar', '2025-05-29 14:00:00', '2025-05-29 15:00:00', 8, 14),
('Visita a casa 15', 'Inspección del domicilio para solución personalizada', '2025-05-30 08:30:00', '2025-05-30 09:30:00', 16, 15),
('Visita a casa 16', 'Valoración de ubicación para rendimiento óptimo', '2025-05-30 16:30:00', '2025-05-30 17:30:00', 21, 16),
('Visita a casa 17', 'Estudio del entorno del domicilio para propuesta', '2025-07-31 10:00:00', '2025-07-31 11:00:00', 5, 17),
('Visita a casa 18', 'Confirmación de detalles técnicos antes de presupuesto', '2025-03-31 12:00:00', '2025-03-31 13:00:00', 8, 18),
('Visita a casa 19', 'Encuentro en vivienda para cierre técnico', '2025-05-20 09:30:00', '2025-05-20 10:30:00', 16, 19);

SELECT * FROM agenda;

INSERT INTO auditoria (descripcion, fecha, id_trabajador) VALUES
('Ha registrado el evento: 1', '2025-05-20 09:32:15', 4),
('Ha registrado el evento: 2', '2025-05-21 10:10:00', 11),
('Ha registrado el cliente: 5', '2025-05-21 11:45:23', 17),
('Ha eliminado el cliente: 25', '2025-05-21 13:22:41', 1),
('Ha modificado el cliente: 10', '2025-05-22 08:55:17', 2),
('Ha actualizado el evento: 5', '2025-05-22 14:30:00', 10),
('Ha registrado una nueva visita', '2025-05-22 16:40:08', 21),
('Ha eliminado el evento: 31', '2025-05-23 09:00:00', 10),
('Ha registrado una venta al cliente con ID: 7', '2025-05-23 17:45:00', 21),
('Ha actualizado el trabajador: Jesús Molina López', '2025-05-24 12:15:33', 12);

SELECT * FROM auditoria;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;