const Obra = require('./Obra')
const Nivel = require('./Nivel')
const Zona = require('./Zona')
const Actividad = require('./Actividad')

const Personal = require('./Personal')
const User = require('./Users')
const ValeSalida = require('./ValeSalida')
const DetalleSalida = require('./DetalleSalida')
const Insumo = require('./Insumos')
const Role = require('./Role')
const Permisos = require('./Permisos')
const Notificaciones = require('./Notificaciones')

const Prestamos = require('./Prestamos')


const Bitacora = require('./Bitacora')
const TipoBitacora = require('./TipoBitacora')
const GaleriaBitacora = require('./GaleriaBitacora')

// Este archivo genera las relacion que existen entre modelos, para evitar confictos en la generación de relaciones.

// En esta parte solo son relaciones many to many, y genera automaticamente las tablas que se necesitan mediante el valor through.

// Relaciones many to many entre Centro Costo y Niveles 
Obra.belongsToMany(Nivel, {  through: 'pivot_niveles_obras', foreignKey: 'obraId' })
Nivel.belongsToMany(Obra, {  through: 'pivot_niveles_obras', foreignKey: 'nivelesId'  });

// Relaciones many to many entre Nivel y Zona
Nivel.belongsToMany(Zona, {  through: 'pivot_niveles_zonas', foreignKey: 'nivelesId'  });
Zona.belongsToMany(Nivel, {  through: 'pivot_niveles_zonas', foreignKey: 'zonasId'  });

// Relaciones many to many entre Nivel y Actividad
Nivel.belongsToMany(Actividad, {  through: 'pivot_niveles_actividades', foreignKey: 'nivelesId'  });
Actividad.belongsToMany(Nivel, {  through: 'pivot_niveles_actividades', foreignKey: 'actividadesId'  });

Role.belongsToMany(Permisos, {  through: 'pivot_roles_permisos', foreignKey: 'roleId'  });
Permisos.belongsToMany(Role, {  through: 'pivot_roles_permisos', foreignKey: 'permisoId'  });


// En esta parte solo son relaciones one to many o many to one entre tablas
Personal.belongsTo(User, { foreignKey: 'userId' })

//Vales
ValeSalida.belongsTo(User, { foreignKey: 'userId', as: 'user' })
ValeSalida.belongsTo(Obra, { foreignKey: 'obraId', as: 'obra' })
ValeSalida.belongsTo(Nivel, { foreignKey: 'nivelId', as: 'nivel' })
ValeSalida.belongsTo(Zona, { foreignKey: 'zonaId', as: 'zona' })
ValeSalida.belongsTo(Actividad, { foreignKey: 'actividadId', as: 'actividad' })
ValeSalida.belongsTo(Personal, { foreignKey: 'personalId', as: 'personal' })

ValeSalida.hasMany(DetalleSalida, { foreignKey: 'valeSalidaId' })

DetalleSalida.belongsTo(ValeSalida, { foreignKey: 'valeSalidaId' })
DetalleSalida.belongsTo(Insumo, { foreignKey: 'insumoId' })

User.hasMany(Notificaciones, { foreignKey: 'userId' })

// ROles
Role.hasMany(User, { foreignKey: 'tipoUsuario_id' })

Prestamos.belongsTo(User, { foreignKey: 'deliverTo', as: 'residente' })
Prestamos.belongsTo(User, { foreignKey: 'belongsTo', as: 'owner' })

User.hasMany(Prestamos, { foreignKey: 'deliverTo', as: 'prestamosDeliver' })
User.hasMany(Prestamos, { foreignKey: 'belongsTo', as: 'prestamosOwner' })

ValeSalida.hasOne(Prestamos, { foreignKey: 'valeSalidaId' })

// Insumos
Insumo.hasMany(DetalleSalida, { foreignKey: 'insumoId' })


// Prestamos
Prestamos.hasOne( DetalleSalida, {foreignKey: 'prestamoId'} )
DetalleSalida.belongsTo( Prestamos, {foreignKey: 'prestamoId'} )


// Bitacora
Bitacora.belongsToMany(User, {  through: 'pivot_bitacora_users', foreignKey: 'bitacoraId'  });
User.belongsToMany(Bitacora, {  through: 'pivot_bitacora_users', foreignKey: 'userId'  });

Bitacora.belongsToMany(GaleriaBitacora, {  through: 'pivot_bitacora_galeria', foreignKey: 'bitacoraId'  });
GaleriaBitacora.belongsToMany(Bitacora, {  through: 'pivot_bitacora_galeria', foreignKey: 'galeriaId'  });

Bitacora.belongsTo(TipoBitacora, { foreignKey: 'tipoBitacoraId' })
Bitacora.belongsTo(Obra, { foreignKey: 'obraId' })
Bitacora.belongsTo(Nivel, { foreignKey: 'nivelId' })
Bitacora.belongsTo(Zona, { foreignKey: 'zonaId' })
Bitacora.belongsTo(Actividad, { foreignKey: 'actividadId' })
Bitacora.belongsTo(Personal, { foreignKey: 'personalId' })

TipoBitacora.hasMany(Bitacora, { foreignKey: 'tipoBitacoraId' })


module.exports = {
    Obra,
    Nivel,
    Zona,
    Personal,
    ValeSalida,
    DetalleSalida,
    Role,
    Prestamos
}
