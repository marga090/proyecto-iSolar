import { query } from '../models/db.js';

export const crear = async (venta) => {
    const {
        idTrabajador,
        idCliente,
        fechaFirma,
        formaPago,
        certificadoEnergetico,
        gestionSubvencion,
        gestionLegalizacion,
        fechaLegalizacion,
        estado = 'pendiente'
    } = venta;

    await query("START TRANSACTION");

    try {
        const existeTrabajador = await query(
            "SELECT 1 FROM trabajador WHERE id_trabajador = ?",
            [idTrabajador]
        );
        if (existeTrabajador.length === 0) {
            throw new Error("El trabajador seleccionado no existe");
        }

        const existeCliente = await query(
            "SELECT 1 FROM cliente WHERE id_cliente = ?",
            [idCliente]
        );
        if (existeCliente.length === 0) {
            throw new Error("El cliente seleccionado no existe");
        }

        const sql = `
            INSERT INTO venta (
                id_trabajador,
                id_cliente,
                fecha_firma,
                forma_pago,
                certificado_energetico,
                gestion_subvencion,
                gestion_legalizacion,
                fecha_legalizacion,
                estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const resultado = await query(sql, [
            idTrabajador,
            idCliente,
            fechaFirma,
            formaPago,
            certificadoEnergetico,
            gestionSubvencion,
            gestionLegalizacion,
            fechaLegalizacion,
            estado
        ]);

        await query("COMMIT");

        return {
            message: "Venta registrada correctamente",
            id_venta: resultado.insertId
        };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};


export const obtenerTodos = async () => {
    const sql = `
        SELECT
            v.id_venta,
            v.fecha_firma,
            v.forma_pago,
            v.certificado_energetico,
            v.gestion_subvencion,
            v.gestion_legalizacion,
            v.fecha_legalizacion,
            v.estado,
            c.nombre AS nombre_cliente,
            t.nombre AS nombre_trabajador
        FROM venta v
        JOIN cliente c ON v.id_cliente = c.id_cliente
        JOIN trabajador t ON v.id_trabajador = t.id_trabajador
        ORDER BY v.id_venta DESC
    `;

    return await query(sql);
};

export const obtenerPorId = async (id) => {
    const sql = `
        SELECT
            v.id_venta,
            v.id_trabajador,
            v.id_cliente,
            v.fecha_firma,
            v.forma_pago,
            v.certificado_energetico,
            v.gestion_subvencion,
            v.gestion_legalizacion,
            v.fecha_legalizacion,
            v.estado,
            c.nombre AS nombre_cliente,
            t.nombre AS nombre_trabajador
        FROM venta v
        JOIN cliente c ON v.id_cliente = c.id_cliente
        JOIN trabajador t ON v.id_trabajador = t.id_trabajador
        WHERE v.id_venta = ?
    `;

    const resultado = await query(sql, [id]);

    if (resultado.length === 0) {
        throw new Error("Venta no encontrada");
    }

    return resultado[0];
};

export const actualizar = async (id, venta) => {
    const {
        idTrabajador,
        idCliente,
        fechaFirma,
        formaPago,
        certificadoEnergetico,
        gestionSubvencion,
        gestionLegalizacion,
        fechaLegalizacion,
        estado
    } = venta;

    await query("START TRANSACTION");

    try {
        const existeTrabajador = await query(
            "SELECT 1 FROM trabajador WHERE id_trabajador = ?",
            [idTrabajador]
        );
        if (existeTrabajador.length === 0) {
            throw new Error("El trabajador seleccionado no existe");
        }

        const existeCliente = await query(
            "SELECT 1 FROM cliente WHERE id_cliente = ?",
            [idCliente]
        );
        if (existeCliente.length === 0) {
            throw new Error("El cliente seleccionado no existe");
        }

        const sql = `
            UPDATE venta
            SET 
                id_trabajador = ?, 
                id_cliente = ?, 
                fecha_firma = ?, 
                forma_pago = ?,
                certificado_energetico = ?, 
                gestion_subvencion = ?, 
                gestion_legalizacion = ?,
                fecha_legalizacion = ?, 
                estado = ?
            WHERE id_venta = ?
        `;

        await query(sql, [
            idTrabajador,
            idCliente,
            fechaFirma,
            formaPago,
            certificadoEnergetico,
            gestionSubvencion,
            gestionLegalizacion,
            fechaLegalizacion,
            estado,
            id
        ]);

        await query("COMMIT");

        return { message: "Venta actualizada correctamente" };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const eliminar = async (id) => {
    await query("DELETE FROM instalacion WHERE id_venta = ?", [id]);
    await query("DELETE FROM venta WHERE id_venta = ?", [id]);

    return { message: "Venta eliminada correctamente" };
};