// importamos express, para las conexiones HTTP y lo almacenamos
const express = require("express");
const app = express();
// importamos mysql
const mysql = require("mysql");
// importamos cors, que permite realizar solicitudes y transferencias de datos entre servidores 
const cors = require("cors");

// permite que el frontend en localhost:3000 haga solicitudes al backend
app.use(cors({ origin: "http://localhost:3000" }));
// convierte las peticiones en formato .json
app.use(express.json());

// creamos la conexion con mysql workbench
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prueba"
});

// creamos la peticion de GUARDAR
app.post("/create", (req, res) => {

    // cuando se haga la consulta y obtengamosla respuesta...
    console.log("Datos recibidos del frontend:", req.body);

    // creamos las constantes de los campos y en ella almacemanos la informacion que llega del body
    const {
        nombreContacto,
        direccionContacto,
        localidadContacto,
        provinciaContacto,
        telefonoContacto,
        observacionesContacto,
        correoContacto,
        modoCaptacion
        // lo que llega de la solicitud
    } = req.body;

    // verificamos que los campos no sean nulos o vacíos
    if (!nombreContacto || !direccionContacto || !localidadContacto || !provinciaContacto || !telefonoContacto || !correoContacto || !modoCaptacion) {
        return res.status(400).json({ error: "Faltan datos que son obligatorios." });
    }

    // validamos el valor de modoCaptacion
    const validCaptationModes = ["Captador", "Telemarketing", "Referido", "Propia"];
    if (!validCaptationModes.includes(modoCaptacion)) {
        return res.status(400).json({ error: "Modo de captación inválido." });
    }

    // insertar valores en la base de datos
    db.query(
        // campos de las tablas de la bd
        'INSERT INTO cliente(nombre, direccion, localidad, provincia, telefono, observaciones, correo, modo_captacion) VALUES(?,?,?,?,?,?,?,?)',
        // variables creadas en la aplicacion
        [nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, observacionesContacto, correoContacto, modoCaptacion],

        // gestionamos los errores
        (err, result) => {
            if (err) {
                // muestra el error de sql
                console.error("Error en la base de datos:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage || "Hubo un error al guardar los datos en la base de datos" });
            }
            res.status(200).json({ message: "Datos guardados correctamente", result });
        }
    );
});

// creamos la peticion de LISTAR
app.get("/clientes", (req, res) => {

    // cuando se haga la consulta y obtengamosla respuesta...
    console.log("Clientes listados", req.body);

    // listar valores de la tabla cliente de la base de datos
    db.query(
        // campos de las tablas de la bd
        'SELECT * FROM cliente',
        // gestionamos los errores
        (err, result) => {
            if (err) {
                // muestra el error de sql
                console.error("Error en la base de datos:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage || "Hubo un error al mostar los datos en la base de datos" });
            }
            res.send(result);
        }
    );
});


// mensaje para verificar que el backend esta funcionando correctamente y escuchando por el puerto 3001
app.listen(3001, () => {
    console.log("Funcionando en el puerto 3001")
})