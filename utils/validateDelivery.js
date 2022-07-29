// Valida si el tiempo de entrega del insumo es mayor a 24 horas 
function validarTiempoEntrega (insumo) {
    const fechaEntrega = new Date()
    const fechaSolicitud = new Date(insumo.createdAt)
    const diferencia = fechaEntrega.getTime() - fechaSolicitud.getTime()
    const horas = Math.floor(diferencia / (1000 * 60 * 60 ))
    console.log(horas)
    if(horas > 24){
        return true // se entrega el insumo
    }
    return false // no se entrega el insumo
}


module.exports = {
    validarTiempoEntrega
}