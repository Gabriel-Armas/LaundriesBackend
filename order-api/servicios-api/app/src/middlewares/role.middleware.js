const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado: Rol no identificado' });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere: ${allowedRoles.join(', ')}` 
            });
        }
    };
};

module.exports = checkRole;