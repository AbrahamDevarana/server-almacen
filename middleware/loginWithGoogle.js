const isUserAuthenticated = async (req, res, next) => {
    if(req.user){
        next()
    }else{
        res.status(401).json({ message: 'Debes iniciar sesión primero'})
    }
}

module.exports = isUserAuthenticated