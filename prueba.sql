-- CREACION DE TABLAS
DROP DATABASE IF EXISTS prueba;
CREATE DATABASE prueba;
USE prueba;

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    direccion VARCHAR(100) NOT NULL UNIQUE,
    localidad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    telefono CHAR(9) NOT NULL UNIQUE,
    observaciones VARCHAR(500),
    correo VARCHAR(100) NOT NULL UNIQUE,
    modo_captacion ENUM("Captador", "Telemarketing", "Referido", "Propia")
);

DESCRIBE cliente;

CREATE TABLE vivienda(
	id_vivienda INT PRIMARY KEY AUTO_INCREMENT,
    n_personas INT,
    tiene_bombona ENUM("Si", "No"),
    tiene_gas ENUM("Si","No"),
    tiene_termo_electrico ENUM("Si","No"),
	tiene_placas_termicas ENUM("Si","No"),
	id_cliente INT,
    
    CONSTRAINT fk_vivienda_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

DESCRIBE vivienda;

CREATE TABLE recibo(
	id_recibo INT PRIMARY KEY AUTO_INCREMENT,
    importe_luz DECIMAL(6,2),
	importe_gas DECIMAL(6,2),
    id_vivienda INT,
    
    CONSTRAINT fk_recibo_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

DESCRIBE recibo;

CREATE TABLE trabajador(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

DESCRIBE trabajador;

CREATE TABLE captador (
	id_trabajador INT PRIMARY KEY,
    
    CONSTRAINT fk_captador FOREIGN KEY (id_trabajador) REFERENCES trabajador (id_trabajador)
);

CREATE TABLE comercial(
	id_trabajador INT PRIMARY KEY,
    
    CONSTRAINT fk_comercial_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador) 
);

DESCRIBE comercial;

CREATE TABLE visita (
	id_visita INT,
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo ENUM ("Corta", "Media", "Larga"),
    resultado enum ("Visitado_pdte_contestación", "Visitado_no_hacen_nada", "Recitar", "No_visita", "Firmada_no_financiable", "Venta"),
	id_vivienda INT,
    id_trabajador INT,
    
    CONSTRAINT pk_visita PRIMARY KEY (id_visita, id_vivienda, id_trabajador),
    CONSTRAINT fk_visita_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_visita_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES comercial(id_trabajador)
);

DESCRIBE visita;

-- INSERTS
INSERT INTO cliente (nombre, direccion, localidad, provincia, telefono, observaciones, correo, modo_captacion) VALUES
	('Juan Pérez', 'Calle Falsa 123', 'Madrid', 'Madrid', '612345678', 'Cliente habitual', 'juan.perez@email.com', 'Captador'),
	('Ana Gómez', 'Avenida de la Paz 456', 'Valencia', 'Valencia', '613456789', 'Interesada en productos nuevos', 'ana.gomez@email.com', 'Telemarketing'),
	('Luis Rodríguez', 'Calle Mayor 789', 'Sevilla', 'Andalucía', '614567890', 'Solicitó información sobre servicios', 'luis.rodriguez@email.com', 'Referido'),
	('María López', 'Calle Gran Vía 10', 'Barcelona', 'Cataluña', '615678901', 'Quiere saber más sobre promociones', 'maria.lopez@email.com', 'Propia'),
	('Carlos Sánchez', 'Plaza España 32', 'Zaragoza', 'Aragón', '616789012', 'No necesita seguimiento', 'carlos.sanchez@email.com', 'Captador'),
	('Isabel Martínez', 'Calle San Juan 54', 'Alicante', 'Comunidad Valenciana', '617890123', 'Interés en seguros', 'isabel.martinez@email.com', 'Telemarketing'),
	('Pedro Díaz', 'Avenida Libertad 21', 'Murcia', 'Murcia', '618901234', 'Cliente potencial para nuevos servicios', 'pedro.diaz@email.com', 'Referido'),
	('Sofía Fernández', 'Calle del Sol 88', 'Córdoba', 'Andalucía', '619012345', 'Requiere seguimiento para productos financieros', 'sofia.fernandez@email.com', 'Propia'),
	('Raúl Martínez', 'Calle Alcalá 123', 'Madrid', 'Madrid', '620123456', 'Ha preguntado por los precios', 'raul.martinez@email.com', 'Captador'),
	('Laura González', 'Calle de la Reina 200', 'Valencia', 'Valencia', '621234567', 'Interesada en promociones especiales', 'laura.gonzalez@email.com', 'Telemarketing'),
	('José Rodríguez', 'Calle del Mar 66', 'Sevilla', 'Andalucía', '622345678', 'Cliente habitual de la empresa', 'jose.rodriguez@email.com', 'Referido'),
	('Carmen García', 'Plaza Mayor 14', 'Barcelona', 'Cataluña', '623456789', 'Solicitó información sobre precios', 'carmen.garcia@email.com', 'Propia'),
	('Francisco Pérez', 'Calle Arenal 99', 'Zaragoza', 'Aragón', '624567890', 'Solicitó consulta sobre servicios personalizados', 'francisco.perez@email.com', 'Captador'),
	('Martín López', 'Calle La Paz 45', 'Alicante', 'Comunidad Valenciana', '625678901', 'Le interesa conocer nuestras promociones', 'martin.lopez@email.com', 'Telemarketing'),
	('Victoria Sánchez', 'Calle San Fernando 22', 'Murcia', 'Murcia', '626789012', 'Requiere contacto para nuevos productos', 'victoria.sanchez@email.com', 'Referido'),
	('Manuel González', 'Calle del Norte 33', 'Córdoba', 'Andalucía', '627890123', 'Está buscando información sobre precios', 'manuel.gonzalez@email.com', 'Propia'),
	('Esther Díaz', 'Avenida Castilla 200', 'Madrid', 'Madrid', '628901234', 'En espera de una oferta personalizada', 'esther.diaz@email.com', 'Captador'),
	('Raquel Fernández', 'Calle Las Delicias 44', 'Valencia', 'Valencia', '629012345', 'Quiere información adicional', 'raquel.fernandez@email.com', 'Telemarketing'),
	('Iván Sánchez', 'Plaza de la Constitución 77', 'Sevilla', 'Andalucía', '630123456', 'Interés en contrato de largo plazo', 'ivan.sanchez@email.com', 'Referido'),
	('Pilar López', 'Calle de los Reyes 21', 'Barcelona', 'Cataluña', '631234567', 'Solicitó contactar para aclaraciones', 'pilar.lopez@email.com', 'Propia'),
	('Ricardo González', 'Calle Marítima 88', 'Zaragoza', 'Aragón', '632345678', 'Requiere más información sobre condiciones', 'ricardo.gonzalez@email.com', 'Captador'),
	('Beatriz Martínez', 'Calle del Río 55', 'Alicante', 'Comunidad Valenciana', '633456789', 'Quiere saber más sobre nuestros servicios', 'beatriz.martinez@email.com', 'Telemarketing'),
	('Óscar Pérez', 'Calle de las Flores 18', 'Murcia', 'Murcia', '634567890', 'Cliente interesado en los descuentos', 'oscar.perez@email.com', 'Referido'),
	('Inés Rodríguez', 'Avenida de Andalucía 10', 'Córdoba', 'Andalucía', '635678901', 'Cliente recurrente, sin necesidades específicas', 'ines.rodriguez@email.com', 'Propia'),
	('Juan Carlos Sánchez', 'Calle de la Estación 120', 'Madrid', 'Madrid', '636789012', 'Solicitó más detalles sobre el producto', 'juancarlos.sanchez@email.com', 'Captador'),
	('Cristina Gómez', 'Calle de la Fuente 200', 'Valencia', 'Valencia', '637890123', 'Interés en seguros y servicios de salud', 'cristina.gomez@email.com', 'Telemarketing'),
	('Santiago Díaz', 'Calle Real 89', 'Sevilla', 'Andalucía', '638901234', 'Solicitó consultar los precios más detallados', 'santiago.diaz@email.com', 'Referido'),
	('Lucía Fernández', 'Calle del Sol 22', 'Barcelona', 'Cataluña', '639012345', 'Quiere saber más sobre nuestras promociones', 'lucia.fernandez@email.com', 'Propia'),
	('Felipe Sánchez', 'Avenida del Centro 75', 'Zaragoza', 'Aragón', '640123456', 'Cliente interesado en la oferta de temporada', 'felipe.sanchez@email.com', 'Captador'),
	('Sergio López', 'Plaza de los Mártires 56', 'Alicante', 'Comunidad Valenciana', '641234567', 'Solicitó más información sobre productos personalizados', 'sergio.lopez@email.com', 'Telemarketing');

SELECT * FROM cliente;

INSERT INTO vivienda (n_personas, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_cliente) VALUES
	(3, 'Si', 'No', 'Si', 'No', 1),
	(4, 'No', 'Si', 'No', 'Si', 2),
	(2, 'Si', 'No', 'Si', 'No', 3),
	(1, 'No', 'No', 'Si', 'Si', 4),
	(5, 'Si', 'Si', 'No', 'No', 5),
	(6, 'No', 'Si', 'No', 'Si', 6),
	(2, 'Si', 'No', 'No', 'No', 7),
	(3, 'No', 'No', 'Si', 'Si', 8),
	(4, 'Si', 'No', 'Si', 'No', 9),
	(1, 'No', 'Si', 'No', 'No', 10),
	(5, 'No', 'No', 'Si', 'Si', 11),
	(2, 'Si', 'No', 'No', 'No', 12),
	(6, 'No', 'Si', 'No', 'Si', 13),
	(3, 'Si', 'No', 'Si', 'No', 14),
	(4, 'No', 'Si', 'No', 'Si', 15),
	(2, 'Si', 'No', 'No', 'No', 16),
	(3, 'No', 'No', 'Si', 'Si', 17),
	(5, 'Si', 'Si', 'No', 'No', 18),
	(6, 'No', 'No', 'Si', 'Si', 19),
	(2, 'Si', 'No', 'Si', 'No', 20),
	(4, 'No', 'Si', 'No', 'Si', 21),
	(3, 'Si', 'No', 'No', 'No', 22),
	(1, 'No', 'Si', 'Si', 'Si', 23),
	(2, 'Si', 'No', 'No', 'Si', 24),
	(5, 'No', 'No', 'Si', 'Si', 25),
	(6, 'No', 'Si', 'No', 'No', 26),
	(3, 'Si', 'No', 'Si', 'No', 27),
	(4, 'No', 'Si', 'No', 'Si', 28),
	(1, 'Si', 'No', 'Si', 'No', 29),
	(3, 'No', 'Si', 'No', 'Si', 30);

SELECT * FROM vivienda;

INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES
	(45.50, 20.30, 1),
	(55.60, 25.40, 2),
	(40.20, 15.00, 3),
	(30.00, 10.50, 4),
	(60.00, 30.00, 5),
	(50.80, 22.10, 6),
	(35.00, 18.00, 7),
	(65.40, 28.90, 8),
	(42.00, 12.80, 9),
	(28.50, 11.00, 10),
	(55.00, 24.70, 11),
	(33.20, 16.50, 12),
	(61.30, 26.00, 13),
	(47.80, 20.00, 14),
	(50.00, 23.10, 15),
	(38.90, 19.00, 16),
	(44.00, 21.50, 17),
	(56.70, 25.00, 18),
	(31.10, 13.80, 19),
	(48.00, 20.80, 20),
	(52.30, 24.20, 21),
	(36.50, 17.60, 22),
	(49.80, 22.30, 23),
	(53.00, 24.90, 24),
	(46.20, 21.00, 25),
	(55.40, 23.40, 26),
	(41.00, 18.50, 27),
	(44.60, 19.20, 28),
	(39.50, 16.40, 29),
	(57.80, 25.60, 30);

SELECT * FROM recibo;

INSERT INTO trabajador (nombre) VALUES
	('Carlos Rodríguez'),
	('Ana Martínez'),
	('Luis Pérez'),
	('María García'),
	('José Sánchez'),
	('Carmen López'),
	('Pedro Fernández'),
	('Raquel González'),
	('Manuel Díaz'),
	('Isabel Romero'),
	('Javier Martínez'),
	('Laura Jiménez'),
	('David López'),
	('Sofía García'),
	('Fernando Rodríguez'),
	('Pilar Sánchez'),
	('Antonio Martínez'),
	('Beatriz González'),
	('Francisco López'),
	('Marta Pérez');

SELECT * FROM trabajador;

INSERT INTO captador (id_trabajador) VALUES
	(1),
	(2),
	(3),
	(4),
	(5);

SELECT * FROM captador;

INSERT INTO comercial (id_trabajador) VALUES
	(6),
	(7),
	(8),
	(9),
	(10),
	(11),
	(12),
	(13),
	(14),
	(15),
	(16),
	(17),
	(18),
	(19),
	(20);

SELECT * FROM comercial;

INSERT INTO visita (id_visita, fecha, hora, tipo, resultado, id_vivienda, id_trabajador) VALUES
	(1, '2024-12-01', '10:00:00', 'Corta', 'Visitado_pdte_contestación', 1, 6),
	(2, '2024-12-01', '11:00:00', 'Media', 'Visitado_no_hacen_nada', 2, 7),
	(3, '2024-12-01', '12:00:00', 'Larga', 'Recitar', 3, 8),
	(4, '2024-12-01', '14:00:00', 'Corta', 'No_visita', 4, 9),
	(5, '2024-12-01', '15:00:00', 'Media', 'Firmada_no_financiable', 5, 10),
	(6, '2024-12-02', '09:30:00', 'Corta', 'Venta', 6, 11),
	(7, '2024-12-02', '10:30:00', 'Media', 'Visitado_pdte_contestación', 7, 12),
	(8, '2024-12-02', '11:30:00', 'Larga', 'Visitado_no_hacen_nada', 8, 13),
	(9, '2024-12-02', '13:00:00', 'Corta', 'Recitar', 9, 14),
	(10, '2024-12-02', '14:00:00', 'Media', 'No_visita', 10, 15),
	(11, '2024-12-03', '10:00:00', 'Larga', 'Firmada_no_financiable', 11, 16),
	(12, '2024-12-03', '11:00:00', 'Corta', 'Venta', 12, 17),
	(13, '2024-12-03', '12:00:00', 'Media', 'Visitado_pdte_contestación', 13, 18),
	(14, '2024-12-03', '14:30:00', 'Larga', 'Visitado_no_hacen_nada', 14, 19),
	(15, '2024-12-03', '15:30:00', 'Corta', 'Recitar', 15, 20),
	(16, '2024-12-04', '09:00:00', 'Media', 'No_visita', 16, 6),
	(17, '2024-12-04', '10:00:00', 'Larga', 'Firmada_no_financiable', 17, 7),
	(18, '2024-12-04', '11:00:00', 'Corta', 'Venta', 18, 8),
	(19, '2024-12-04', '13:00:00', 'Media', 'Visitado_pdte_contestación', 19, 9),
	(20, '2024-12-04', '14:00:00', 'Larga', 'Visitado_no_hacen_nada', 20, 10),
	(21, '2024-12-05', '09:30:00', 'Corta', 'Recitar', 21, 11),
	(22, '2024-12-05', '10:30:00', 'Media', 'No_visita', 22, 12),
	(23, '2024-12-05', '11:30:00', 'Larga', 'Firmada_no_financiable', 23, 13),
	(24, '2024-12-05', '13:00:00', 'Corta', 'Venta', 24, 14),
	(25, '2024-12-05', '14:00:00', 'Media', 'Visitado_pdte_contestación', 25, 15),
	(26, '2024-12-06', '10:00:00', 'Larga', 'Visitado_no_hacen_nada', 26, 16),
	(27, '2024-12-06', '11:00:00', 'Corta', 'Recitar', 27, 17),
	(28, '2024-12-06', '12:00:00', 'Media', 'No_visita', 28, 18),
	(29, '2024-12-06', '14:00:00', 'Larga', 'Firmada_no_financiable', 29, 19),
	(30, '2024-12-06', '15:00:00', 'Corta', 'Venta', 30, 20);

SELECT * FROM visita;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;


