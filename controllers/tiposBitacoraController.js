// Tipos de bitacora

const { TipoBitacora } = require("../models")


exports.getTipoBitacoras = async (req, res) => {
    try {
        const tiposBitacora = await TipoBitacora.findAll()
        res.status(200).json({ message: "Tipo de bitacoras", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tipos de bitacoras", error })
    }
}
exports.createTipoBitacora = async (req, res) => {
    try {
        const { nombre } = req.body
        const tiposBitacora = await TipoBitacora.create({ nombre })
        res.status(200).json({ message: "Tipo de bitacora creado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al crear el tipo de bitacora", error })
    }
}

exports.updateTipoBitacora = async (req, res) => {
    try {
        const { id, nombre } = req.body
        const tiposBitacora = await TipoBitacora.update({ nombre }, { where: { id } })
        res.status(200).json({ message: "Tipo de bitacora actualizado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el tipo de bitacora", error })
    }
}

exports.deleteTipoBitacora = async (req, res) => {
    try {
        const { id } = req.body
        const tiposBitacora = await TipoBitacora.destroy({ where: { id } })
        res.status(200).json({ message: "Tipo de bitacora eliminado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el tipo de bitacora", error })
    }
}