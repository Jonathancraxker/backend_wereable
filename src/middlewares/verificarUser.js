export const verificarAdmin = (req, res, next) => {
    if (req.user && req.user.tipo === 'Admin') {
        next();
    }
    else {
        res.status(403).json({ message: "Acceso denegado. No tienes los permisos necesarios." });
    }
};

export const verificarAdminOrDirectivo = (req, res, next) => {
    if (req.user && (req.user.tipo === 'Admin' || req.user.tipo === 'Directivo')) {
        next();
    }
    else {
        res.status(403).json({ message: "Acceso denegado. No tienes los permisos necesarios." });
    }
};