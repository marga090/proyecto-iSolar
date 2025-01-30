const mysql = require("mysql");

// creamos la conexion con mysql workbench
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prueba"
});

db.connect(err => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
        process.exit(1);
    }
    console.log("Conexión establecida correctamente con la base de datos.");
});

module.exports = db;