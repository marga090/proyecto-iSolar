const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prueba"
});

app.post("/create", (req, res) => {
    console.log("Datos recibidos del frontend:", req.body);

    const { 
        idCliente, 
        nombreContacto, 
        direccionContacto, 
        localidadContacto, 
        provinciaContacto, 
        telefonoContacto, 
        observacionesContacto, 
        correoContacto, 
        modoCaptacion 
    } = req.body;

    // Verificar que los valores no sean nulos o vacíos
    if (!direccionContacto || !telefonoContacto || !correoContacto || !modoCaptacion) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // Validar el valor de modoCaptacion
    const validCaptationModes = ["Captador", "Telemarketing", "Referido", "Propia"];
    if (!validCaptationModes.includes(modoCaptacion)) {
        return res.status(400).json({ error: "Modo de captación inválido." });
    }

    // Insertar en la base de datos
    db.query(
        'INSERT INTO cliente(id_cliente, nombre, direccion, localidad, provincia, telefono, observaciones, correo, modo_captacion) VALUES(?,?,?,?,?,?,?,?,?)',
        [idCliente, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, observacionesContacto, correoContacto, modoCaptacion],
        (err, result) => {
            if (err) {
                console.error("Error en la base de datos:", err.sqlMessage);  // Muestra el mensaje de error específico de MySQL
                return res.status(500).json({ error: err.sqlMessage || "Hubo un error al guardar los datos en la base de datos" });
            }
            res.status(200).json({ message: "Datos guardados correctamente", result });
        }
    );    
});


app.listen(3001, () => {
    console.log("Funcionando en el puerto 3001")
})