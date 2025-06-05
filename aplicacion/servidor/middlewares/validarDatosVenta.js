export const validarDatosVenta = async (req, res, next) => {
    const { idTrabajador, idCliente, estado } = req.body;

    // obligatorios
    if (!idTrabajador || !idCliente || !estado) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    next();
};
