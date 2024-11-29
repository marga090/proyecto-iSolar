-- CREACION DE TABLAS
DROP DATABASE IF EXISTS prueba;
CREATE DATABASE prueba;
USE prueba;

SHOW DATABASES;
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
    tiene_gas ENUM("Si", "No"),
    tiene_termo_electrico ENUM("Si", "No"),
    tiene_placas_termicas ENUM("Si", "No"),
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

CREATE TABLE captador(
	id_trabajador INT,
    CONSTRAINT pk_captador PRIMARY KEY (id_trabajador),
    CONSTRAINT fk_captador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);

DESCRIBE captador;

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
    resultado ENUM ("Visitado_pdte_contestación", "Visitado_no_hacen_nada", "Recitar", "No_visita", "Firmada_no_financiable", "Venta")
);

DESCRIBE visita;