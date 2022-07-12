const Obra = require('./Obra')
const Nivel = require('./Nivel')
const Zona = require('./Zona')
const Actividad = require('./Actividad')

// Este archivo genera relaciones many to many entre tablas


// Relaciones many to many entre Centro Costo y Niveles 
Obra.belongsToMany(Nivel, {  through: 'pivot_niveles_obras', foreignKey: 'obraId' })
Nivel.belongsToMany(Obra, {  through: 'pivot_niveles_obras', foreignKey: 'nivelesId'  });

// Relaciones many to many entre Nivel y Zona
Nivel.belongsToMany(Zona, {  through: 'pivot_niveles_zonas', foreignKey: 'nivelesId'  });
Zona.belongsToMany(Nivel, {  through: 'pivot_niveles_zonas', foreignKey: 'zonasId'  });

// Relaciones many to many entre Nivel y Actividad
Nivel.belongsToMany(Actividad, {  through: 'pivot_niveles_actividades', foreignKey: 'nivelesId'  });
Actividad.belongsToMany(Nivel, {  through: 'pivot_niveles_actividades', foreignKey: 'actividadesId'  });




module.exports = {
    Obra,
    Nivel,
    Zona
}
