import { query } from "../models/db.js";

export const crear = async (feedback) => {
    const {
        idTrabajador,
        idCliente,
        fecha,
        hora,
        numeroPersonas,
        numeroDecisores,
        tieneBombona,
        tieneGas,
        tieneTermo,
        tienePlacas,
        importeLuz,
        importeGas,
        resultado,
        oferta,
        estructura,
        observaciones
    } = feedback;

    const numeroPersonasNormalizado = numeroPersonas === '' ? null : parseInt(numeroPersonas);
    const importeLuzNormalizado = importeLuz === '' ? null : parseInt(importeLuz);
    const importeGasNormalizado = importeGas === '' ? null : parseInt(importeGas);

    await query("START TRANSACTION");

    try {
        const [existeTrabajador] = await query(
            "SELECT 1 FROM trabajador WHERE id_trabajador = ?",
            [idTrabajador]
        );

        if (!existeTrabajador) {
            throw new Error("El trabajador no existe");
        }

        const [existeCliente] = await query(
            "SELECT 1 FROM cliente WHERE id_cliente = ?",
            [idCliente]
        );

        if (!existeCliente) {
            throw new Error("El cliente no existe");
        }

        let idVivienda;

        const [resultadoVivienda] = await query(
            "SELECT id_vivienda FROM vivienda WHERE id_domicilio = ?",
            [idCliente]
        );

        if (!resultadoVivienda) {
            const [resultadoDomicilio] = await query(
                "SELECT id_domicilio FROM domicilio WHERE id_cliente = ?",
                [idCliente]
            );

            if (!resultadoDomicilio) {
                throw new Error("El cliente no tiene un domicilio registrado.");
            }

            const idDomicilio = resultadoDomicilio.id_domicilio;

            const resultadoInserccionVivienda = await query(
                "INSERT INTO vivienda (numero_personas, numero_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, estructura, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    numeroPersonasNormalizado,
                    numeroDecisores,
                    tieneBombona,
                    tieneGas,
                    tieneTermo,
                    tienePlacas,
                    estructura,
                    idDomicilio
                ]
            );

            idVivienda = resultadoInserccionVivienda.insertId;
        } else {
            idVivienda = resultadoVivienda.id_vivienda;
        }

        await query(
            "INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)",
            [importeLuzNormalizado, importeGasNormalizado, idVivienda]
        );

        const resultadoVisita = await query(
            "INSERT INTO visita (fecha, hora, resultado, oferta, observaciones, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [fecha, hora, resultado, oferta, observaciones, idVivienda, idTrabajador]
        );

        await query("COMMIT");

        return {
            message: "Feedback registrado correctamente",
            idVisita: resultadoVisita.insertId
        };

    } catch (error) {
        await query("ROLLBACK");
        throw new Error(error.message);
    }
};