const { validationResult } = require('express-validator');
const Proyectos = require('../models/Proyectos');
const { Op } = require('sequelize');
const { uploadDynamicFiles, deleteDynamicFiles } = require('../utils/dynamicFiles');
const formidable = require('formidable-serverless');

exports.getProyectos = async (req, res) => {
    try {
        await Proyectos.findAll().then(proyectos => {
            res.status(200).json({ proyectos });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudieron obtener los proyectos' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudieron obtener los proyectos' });
    }
}

exports.getProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        await Proyectos.findByPk(id).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo obtener el proyecto' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo obtener el proyecto' });
    }
}

exports.createProyecto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.map() });
    }

    try {
        const form = new formidable.IncomingForm({ multiples: true })
        form.keepExtensions = true
        form.parse(req, async (err, fields, files) => {
            
            if (err) {
                console.log(err)
                return res.status(400).json({ msg: 'No se pudo crear el proyecto' });
            }
            const { nombre, clave } = fields;

            const galeria = Object.values(files)
            const logo = galeria[0]
            
            await Proyectos.create({
                nombre,
                clave,
            }).then(proyecto => {

                if (logo) {
                    uploadDynamicFiles([logo], 'proyectos').then( async (galeriaSet) => {
                        await Proyectos.update({
                            logo: galeriaSet[0].url
                        }, 
                        {
                            where: {
                                id: proyecto.id
                            }
                        })
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({ msg: 'No se pudo cargar la imagen' });
                    });
                }
                            

                res.status(200).json({ proyecto });
            }
            ).catch(error => {
                console.log(error);
                res.status(500).json({ msg: 'No se pudo crear el proyecto' });
            });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo crear el proyecto' });
    }
}

exports.updateProyecto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.map() });
    }
    


    try {
        const form = new formidable.IncomingForm({ multiples: true })
        form.keepExtensions = true
        form.parse(req, async (err, fields, files) => {
            
            if (err) {
                console.log(err)
                return res.status(400).json({ msg: 'No se pudo crear el proyecto' });
            }
            const { nombre, clave } = fields;

            const galeria = Object.values(files)
            const logo = galeria[0]

            const { id } = req.params;

            // borrar la imagen anterior
            const proyecto = await Proyectos.findByPk(id);

            if(proyecto.logo !== null) {
                console.log(oldLogo);
                const resultDelete = await deleteDynamicFiles(oldLogo);
                
                if (resultDelete.code !== 200) {
                    console.log('No se pudo borrar la imagen anterior');
                }
            }   
            

            await Proyectos.update({
                nombre,
                clave,
            }, {
                where: {
                    id
                }
            }).then(async proyecto => {
                if (logo) {
                    uploadDynamicFiles([logo], 'proyectos').then( async (galeriaSet) => {
                        await Proyectos.update({ logo: galeriaSet[0].url }, { where: { id } })
                        
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({ msg: 'No se pudo cargar la imagen' });
                    });
                }
    
                res.status(200).json({ proyecto });
                }).catch(error => {
                    console.log(error);
                    res.status(500).json({ msg: 'No se pudo actualizar el proyecto' });
                }
            );
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo actualizar el proyecto' });
    }
}

exports.deleteProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        await Proyectos.update({
            status: false 
        }, {
            where: {
                id
            }
        }).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo eliminar el proyecto' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo eliminar el proyecto' });
    }
}