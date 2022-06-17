import jwt from 'jsonwebtoken';
import Veterinarian from '../models/Veterinarian.js';

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log("Has the Bearer token");
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.veterinarian = await Veterinarian.findById(decoded.id).select('-password -token -confirmed');
            
            return next();
        } catch (e) {
            const error = new Error("Invalid token");
            return res.status(403).json({msg: error.message});
        }
    }

    if (!token) {
        const error = new Error("Invalid or unexistant token");
        res.status(403).json({msg: error.message});
    }

    next();
};

export default checkAuth;