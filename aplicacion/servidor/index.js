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
        idTrabajador,
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
        importeLuz,
        importeGas,
        observacionesContacto

        // lo que llega de la solicitud
    } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !nombreContacto || !telefonoContacto || !correoContacto || !calleContacto ||
        !numeroVivienda || !localidadContacto || !provinciaContacto || !fechaVisita || !horaVisita) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // validaciones del telefono y del correo
    if (!/^\d{9}$/.test(telefonoContacto)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    if (!/\S+@\S+\.\S+/.test(correoContacto)) {
        return res.status(400).json({ error: "El correo no es válido" });
    }

    // consultar si ya existe un cliente con el mismo teléfono o correo
    const comprobarCliente = 'SELECT * FROM cliente WHERE telefono = ? OR correo = ?';
    db.query(comprobarCliente, [telefonoContacto, correoContacto], (err, result) => {
        if (err) {
            console.error("Error al comprobar cliente:", err);
            return res.status(500).json({ error: "Error al comprobar cliente" });
        }

        console.log(result);

        // si ya existe ese cliente
        if (result.length > 0) {
            const duplicado = result[0]; // Primer registro encontrado
            if (duplicado.telefono === telefonoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese teléfono" });
            }
            if (duplicado.correo === correoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese correo" });
            }
        }

        // si no existe insertamos el cliente
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
                // de los campos del formulario
                db.query(sqlDireccion, [calleContacto, numeroVivienda, localidadContacto, provinciaContacto, idCliente], (err, result) => {
                    if (err) {
                        console.error("Error al insertar dirección:", err);
                        return res.status(500).json({ error: "Error al insertar dirección" });
                    }

                    const idDireccion = result.insertId;

                    // insertamos la vivienda asociada a la dirección
                    const sqlVivienda = 'INSERT INTO vivienda (n_personas, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_direccion) VALUES (?, ?, ?, ?, ?, ?)';
                    // de los campos del formulario
                    db.query(sqlVivienda, [numeroPersonas, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, idDireccion], (err, result) => {
                        if (err) {
                            console.error("Error al insertar vivienda:", err);
                            return res.status(500).json({ error: "Error al insertar vivienda" });
                        }

                        const idVivienda = result.insertId;

                        // insertamos los recibos de luz y gas asociados a la vivienda
                        const sqlRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
                        // de los campos del formulario
                        db.query(sqlRecibo, [importeLuz, importeGas, idVivienda], (err, result) => {
                            if (err) {
                                console.error("Error al insertar recibo:", err);
                                return res.status(500).json({ error: "Error al insertar recibo" });
                            }

                            // insertamnos la fecha y hora a la visita
                            const sqlVisita = 'INSERT INTO visita (fecha, hora, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?)';
                            // de los campos del formulario
                            db.query(sqlVisita, [fechaVisita, horaVisita, idVivienda, idTrabajador], (err, result) => {
                                if (err) {
                                    console.error("Error al insertar visita:", err);
                                    return res.status(500).json({ error: "Error al insertar visita" });
                                }

                                // ha salido bien
                                res.status(200).json({ message: "Cliente registrado correctamente" });
                            });
                        });
                    });
                });
            });
    });
});

// mensaje para verificar que el backend esta funcionando correctamente y escuchando por el puerto 3001
app.listen(3001, () => {
    console.log("Servidor funcionando en el puerto 3001")
})