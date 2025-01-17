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

// consulta a la base de datos con async/await
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// intermediario para las validaciones de los datos
const validarDatos = (req, res, next) => {
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto, fechaVisita, horaVisita, numeroPersonas, numeroDecisores, importeLuz, importeGas } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !nombreContacto || !direccionContacto || !localidadContacto || !provinciaContacto || !telefonoContacto || !correoContacto || !fechaVisita || !horaVisita || !numeroDecisores) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // validaciones con expresiones regulares
    if (!/^\d{9}$/.test(telefonoContacto)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    if (!/\S+@\S+\.\S+/.test(correoContacto)) {
        return res.status(400).json({ error: "El correo no es válido" });
    }

    // validaciones de campos que deben ser numeros positivos
    if (numeroPersonas < 0 || isNaN(numeroPersonas)) {
        return res.status(400).json({ error: "El número de personas debe ser un número positivo" });
    }

    if (numeroDecisores < 0 || isNaN(numeroDecisores)) {
        return res.status(400).json({ error: "El número de decisores debe ser un número positivo" });
    }

    if (importeLuz < 0 || isNaN(importeLuz)) {
        return res.status(400).json({ error: "El importe de luz debe ser un número positivo" });
    }

    if (importeGas < 0 || isNaN(importeGas)) {
        return res.status(400).json({ error: "El importe de gas debe ser un número positivo" });
    }

    // si todo es correcto, pasa a la siguiente validacion
    next();
};

// creamos la peticion de GUARDAR
app.post("/create", validarDatos, async (req, res) => {

    // cuando se haga la consulta y obtengamos la respuesta...
    console.log("Datos recibidos del frontend:", req.body);

    // extraemos los datos recibidos del body
    const {
        idTrabajador,
        nombreContacto,
        direccionContacto,
        localidadContacto,
        provinciaContacto,
        telefonoContacto,
        correoContacto,
        fechaVisita,
        horaVisita,
        numeroPersonas,
        numeroDecisores,
        tieneBombona,
        tieneGas,
        tieneTermoElectrico,
        tienePlacasTermicas,
        importeLuz,
        importeGas,
        observacionesContacto
    } = req.body;

    try {
        // consultamos si el trabajador existe
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El ID del trabajador no existe en la base de datos." });
        }

        // consultamos si ya existe un cliente con el telefono o correo introducidos
        const existeCliente = await query('SELECT * FROM cliente WHERE telefono = ? OR correo = ?', [telefonoContacto, correoContacto]);

        if (existeCliente.length > 0) {
            const existe = existeCliente[0];
            if (existe.telefono === telefonoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese teléfono" });
            }
            if (existe.correo === correoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese correo" });
            }
        }

        // introducimos las consultas en una transaccion, por si alguna falla, para que no se realice ninguna modificacion en la base de datos
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(500).json({ error: "Error al iniciar la transacción" });
            }

            try {
                // insertamos el cliente
                const sqlCliente = 'INSERT INTO cliente (nombre, telefono, correo, observaciones) VALUES (?,?,?,?)';
                const resultadoCliente = await query(sqlCliente, [nombreContacto, telefonoContacto, correoContacto, observacionesContacto]);
                const idCliente = resultadoCliente.insertId;

                // insertamos el domicilio del cliente
                const sqlDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
                const resultadoDomicilio = await query(sqlDomicilio, [direccionContacto, localidadContacto, provinciaContacto, idCliente]);
                const idDomicilio = resultadoDomicilio.insertId;

                // insertamos la vivienda asociada a la direccion
                const sqlVivienda = 'INSERT INTO vivienda (n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const resultadoVivienda = await query(sqlVivienda, [numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, idDomicilio]);
                const idVivienda = resultadoVivienda.insertId;

                // insertamos los recibos de luz y gas asociados a la vivienda
                const sqlRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
                await query(sqlRecibo, [importeLuz, importeGas, idVivienda]);

                // insertamos la fecha y hora de la visita
                const sqlVisita = 'INSERT INTO visita (fecha, hora, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?)';
                await query(sqlVisita, [fechaVisita, horaVisita, idVivienda, idTrabajador]);

                // confirmamos la transaccion
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error en la transacción, rollback:", err);
                            res.status(500).json({ error: "Error al procesar la solicitud" });
                        });
                    }

                    // si no ha habido errores
                    res.status(200).json({ message: "Cliente registrado correctamente" });
                });
            } catch (err) {
                db.rollback(() => {
                    console.error("Error durante la transacción:", err);
                    res.status(500).json({ error: "Error al procesar la solicitud" });
                });
            }
        });
    } catch (err) {
        console.error("Error al procesar la solicitud:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

// mensaje para verificar que el backend esta funcionando correctamente y escuchando en el puerto 3001
app.listen(3001, () => {
    console.log("Servidor funcionando en el puerto 3001");
});
