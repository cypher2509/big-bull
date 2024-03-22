import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    try {
    let token = req.headers.authorization;
    if (token) {
        token = token.split(" ")[1];
        let decoded = jwt.verify(token, 'bullrun');
        req.user = decoded.user;
        req.gameId = decoded.gameId;
        
        next();
    }
    else{
        res.status(401).json({ error: 'Access denied' });
    }
    
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
    };