const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporcionó token' });
    }

    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7, authHeader.length) 
        : authHeader;

    try {
        // IMPORTANTE: Asegúrate de tener JWT_ACCESS_SECRET en tu .env igual al de él
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = verifyToken;