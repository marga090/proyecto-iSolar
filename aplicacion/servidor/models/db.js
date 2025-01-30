const db = require("../config/dbConfig");

// consulta a la base de datos con async/await
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = { query }