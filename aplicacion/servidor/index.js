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
        calleContacto,
        numeroVivienda,
        localidadContacto,
        provinciaContacto,
        telefonoContacto,
        correoContacto,
        fechaVisita,
        horaVisita,
        numeroPersonas,
        tieneBombona,
        tieneGas,
        tieneTermoElectrico,
        tienePlacasTermicas,
        reciboLuz,
        reciboGas,
        observacionesContacto

        // lo que llega de la solicitud
    } = req.body;

    // insertamos el cliente
    const sqlCliente = 'INSERT INTO cliente (nombre, telefono, correo, observaciones) VALUES (?,?,?,?)';
    // de los campos del formulario
    db.query(sqlCliente, [nombreContacto, telefonoContacto, correoContacto, observacionesContacto],

        // gestionamos los errores
        (err, result) => {
            if (err) {
                console.error("Error al insertar el cliente", err);
                return res.status(500).json({ error: "Error al insertar el cliente" });
            }

            const idCliente = result.insertId;

            // insertamos la direccion asociada al cliente
            const sqlDireccion = 'INSERT INTO direccion (calle, numero, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?, ?)';
            db.query(sqlDireccion, [calleContacto, numeroVivienda, localidadContacto, provinciaContacto, idCliente], (err, result) => {
                if (err) {
                    console.error("Error al insertar dirección:", err);
                    return res.status(500).json({ error: "Error al insertar dirección" });
                }

                const idDireccion = result.insertId;

                // insertamos la vivienda asociada a la dirección
                const sqlVivienda = 'INSERT INTO vivienda (n_personas, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_direccion) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(sqlVivienda, [numeroPersonas, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, idDireccion], (err, result) => {
                    if (err) {
                        console.error("Error al insertar vivienda:", err);
                        return res.status(500).json({ error: "Error al insertar vivienda" });
                    }

                    const idVivienda = result.insertId;

                    // insertamos los recibos de luz y gas asociados a la vivienda
                    const sqlRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
                    db.query(sqlRecibo, [reciboLuz, reciboGas, idVivienda], (err, result) => {
                        if (err) {
                            console.error("Error al insertar recibo:", err);
                            return res.status(500).json({ error: "Error al insertar recibo" });
                        }

                        // ha salido bien
                        res.status(200).json({ message: "Cliente registrado correctamente" });
                    });
                });
            });
        });
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