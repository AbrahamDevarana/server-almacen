const isUserAuthenticated = async (req, res, next) => {
    if(req.user){
        next()
    }else{
        res.status(401).json({ message: 'Error al iniciar sesión'})
    }
}

module.exports = isUserAuthenticated