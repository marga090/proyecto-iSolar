import { query } from '../models/db.js';

export const crear = async (agenda) => {
    const {
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        idTrabajador,
        idVivienda,
        estado = 'pendiente',
        fechaAsignacion = new Date()
    } = agenda;

    await query("START TRANSACTION");

    try {
        const existeVivienda = await query(
            "SELECT 1 FROM vivienda WHERE id_vivienda = ?",
            [idVivienda]
        );
        if (existeVivienda.length === 0) {
            throw new Error("La vivienda seleccionada no existe");
        }

        const sql = `
            INSERT INTO agenda (
                titulo,
                descripcion,
                fecha_inicio,
                fecha_fin,
                id_trabajador,
                id_vivienda,
                estado,
                fecha_asignacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const resultado = await query(sql, [
            titulo,
            descripcion,
            fechaInicio,
            fechaFin,
            idTrabajador,
            idVivienda,
            estado,
            fechaAsignacion
        ]);

        await query("COMMIT");

        return {
            message: "Entrada en agenda creada correctamente",
            idAgenda: resultado.insertId
        };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const obtenerTodas = async () => {
    const sql = `
        SELECT 
            a.*,
            t.nombre AS nombre_trabajador,
            v.id_domicilio
        FROM agenda a
        LEFT JOIN trabajador t ON a.id_trabajador = t.id_trabajador
        LEFT JOIN vivienda v ON a.id_vivienda = v.id_vivienda
    `;

    const resultado = await query(sql);

    return resultado;
};

export const obtenerPorId = async (id) => {
    const sql = `
        SELECT * 
        FROM agenda 
        WHERE id_agenda = ?
    `;

    const resultado = await query(sql, [id]);

    return resultado.length > 0 ? resultado[0] : null;
};

export const actualizar = async (id, datosEvento) => {
    const {
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        idTrabajador,
        idVivienda,
        estado
    } = datosEvento;

    await query("START TRANSACTION");

    try {
        const existeVivienda = await query(
            "SELECT 1 FROM vivienda WHERE id_vivienda = ?",
            [idVivienda]
        );
        if (existeVivienda.length === 0) {
            throw new Error("La vivienda seleccionada no existe");
        }

        const sql = `
        UPDATE agenda 
        SET 
            titulo = ?,
            descripcion = ?,
            fecha_inicio = ?,
            fecha_fin = ?,
            id_trabajador = ?,
            id_vivienda = ?,
            estado = ?
        WHERE id_agenda = ?
    `;

        await query(sql, [
            titulo,
            descripcion,
            fechaInicio,
            fechaFin,
            idTrabajador,
            idVivienda,
            estado,
            id
        ]);

        await query("COMMIT");

        return { message: "Entrada en agenda actualizada correctamente" };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const eliminar = async (id) => {
    const sql = `
        DELETE FROM agenda 
        WHERE id_agenda = ?
    `;

    await query(sql, [id]);

    return { message: "Agenda eliminada correctamente" };
};