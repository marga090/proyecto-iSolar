-- CREACION DE TABLAS
DROP DATABASE IF EXISTS prueba;
CREATE DATABASE prueba;
USE prueba;

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    telefono CHAR(9) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    modo_captacion ENUM("Captador", "Telemarketing", "Referido", "Propia"),
    observaciones VARCHAR(500)
);

DESCRIBE cliente;

CREATE TABLE direccion (
	id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    calle VARCHAR(100) NOT NULL,
    numero VARCHAR(5) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    id_cliente INT,
    
    CONSTRAINT fk_direccion_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

DESCRIBE direccion;

CREATE TABLE vivienda(
	id_vivienda INT PRIMARY KEY AUTO_INCREMENT,
    n_personas INT,
    tiene_bombona ENUM("Si", "No", "Sin datos"),
    tiene_gas ENUM("Si","No", "Sin datos"),
    tiene_termo_electrico ENUM("Si","No", "Sin datos"),
	tiene_placas_termicas ENUM("Si","No", "Sin datos"),
	id_direccion INT,
    
    CONSTRAINT fk_vivienda_id_direccion FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion) ON DELETE CASCADE
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
    nombre VARCHAR(50) NOT NULL,
    telefono CHAR(9) NOT NULL,
    tipo_trabajador ENUM("Captador", "Comercial")
);

DESCRIBE trabajador;

CREATE TABLE visita (
	id_visita INT PRIMARY KEY AUTO_INCREMENT,
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo ENUM ("Corta", "Media", "Larga"),
    resultado ENUM ("Visitado_pdte_contestación", "Visitado_no_hacen_nada", "Recitar", "No_visita", "Firmada_no_financiable", "Venta"),
	id_vivienda INT,
    id_trabajador INT,
    
    CONSTRAINT fk_visita_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_visita_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);

DESCRIBE visita;

-- INSERTS
INSERT INTO cliente (nombre, telefono, correo, modo_captacion, observaciones) VALUES
    ('Juan Pérez', '612345678', 'juan.perez@email.com', 'Captador', 'Cliente captado por un amigo'),
    ('María López', '612987654', 'maria.lopez@email.com', 'Telemarketing', 'Interesada en la oferta de gas'),
    ('Carlos García', '612123456', 'carlos.garcia@email.com', 'Referido', 'Quiere más información sobre tarifas'),
    ('Laura Martínez', '612789123', 'laura.martinez@email.com', 'Propia', 'Ya es cliente, necesita asistencia'),
    ('José Torres', '612555123', 'jose.torres@email.com', 'Captador', 'Cliente en proceso de verificación'),
    ('Sofía Ruiz', '612666789', 'sofia.ruiz@email.com', 'Telemarketing', 'Interesada en la oferta de energía renovable');

SELECT * FROM cliente;

INSERT INTO direccion (calle, numero, localidad, provincia, id_cliente) VALUES
    ('Calle Falsa', 10, 'Madrid', 'Madrid', 1),
    ('Avenida Siempre Viva', 123, 'Barcelona', 'Barcelona', 2),
    ('Calle de la Luna', 45, 'Sevilla', 'Sevilla', 3),
    ('Calle Real', 80, 'Valencia', 'Valencia', 4),
    ('Calle del Sol', 15, 'Madrid', 'Madrid', 5),
    ('Calle de la Paz', 30, 'Bilbao', 'Vizcaya', 6);

SELECT * FROM direccion;

INSERT INTO vivienda (n_personas, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_direccion) VALUES
    (3, 'Si', 'No', 'Si', 'No', 1),
    (4, 'No', 'Si', 'No', 'Si', 2),
    (2, 'Si', 'Si', 'No', 'No', 3),
    (5, 'No', 'No', 'Si', 'No', 4),
    (6, 'Si', 'Si', 'Si', 'Si', 5),
    (2, 'No', 'No', 'No', 'No', 6);

SELECT * FROM vivienda;

INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES
    (50.25, 30.10, 1),
    (70.50, 40.00, 2),
    (45.00, 20.00, 3),
    (90.00, 60.00, 4),
    (55.00, 35.00, 5),
    (60.00, 50.00, 6);

SELECT * FROM recibo;

INSERT INTO trabajador (nombre, telefono, tipo_trabajador) VALUES
    ('Pedro Pérez', '600111222', 'Captador'),
    ('Ana Gómez', '600333444', 'Comercial'),
    ('Luis Martín', '600555666', 'Comercial'),
    ('Elena Ruiz', '600777888', 'Captador'),
    ('David Pérez', '600999000', 'Captador'),
    ('María Díaz', '600222333', 'Comercial');

SELECT * FROM trabajador;

INSERT INTO visita (fecha, hora, tipo, resultado, id_vivienda, id_trabajador) VALUES
    ('2024-01-15', '10:30', 'Corta', 'Visitado_pdte_contestación', 1, 1),
    ('2024-01-16', '14:00', 'Media', 'Visitado_no_hacen_nada', 2, 2),
    ('2024-01-17', '16:00', 'Larga', 'Recitar', 3, 3),
    ('2024-01-18', '11:30', 'Media', 'No_visita', 4, 4),
    ('2024-01-19', '09:00', 'Corta', 'Firmada_no_financiable', 5, 5),
    ('2024-01-20', '13:00', 'Larga', 'Venta', 6, 6);

SELECT * FROM visita;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;