const Sequelize = require('sequelize')
const db = require('../config/db')

const Bitacora = db.define('bitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    uid:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4        
    },
    folio:{
        type: Sequelize.STRING,
        unique: true,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    etapaId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    actividad: {
        type: Sequelize.TEXT,
    },
    externoId: {
        type: Sequelize.INTEGER,
    },
    autorId: {
        type: Sequelize.INTEGER,
    },
    proyectoId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    esInterno:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    empresaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    tipoBitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    paranoid: true,
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
   },
    hooks: {
        beforeUpdate: (bitacora) => {
            bitacora.updatedAt = new Date()
        },
        afterCreate: async (bitacora) => {
            // Obtener el la clave del proyecto y el id de la bitacora

            const countBitacoras = await Bitacora.count({
                where: {
                    proyectoId: bitacora.proyectoId
                }
            })

            bitacora.getProyecto().then(proyecto => {
                // consultar el tipo de bitacora

                bitacora.update({
                    folio: `${proyecto.clave}-${countBitacoras}`
                })
            }) 
        }
            
            
    }
})

module.exports = Bitacora