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


// ROles
Role.hasMany(User, { foreignKey: 'tipoUsuario_id' })

module.exports = {
    Obra,
    Nivel,
    Zona,
    Personal,
    ValeSalida,
    DetalleSalida,
    Role
}
