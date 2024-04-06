import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    try {
    let token = req.cookies.token;
    if(!token){
        console.log("token not in cookie");
        token = req.headers.authorization;
        token = token.split(" ")[1]; 
        console.log("token from header: "+token);   
    }
    if(!token){
        res.status(401).json({ error: 'Access denied' });
    }
    let decoded = jwt.verify(token, 'bullrun');
    req.user = decoded.user;
        req.gameId = decoded.gameId;
        
        next();
    }
    
    
     catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid token' });
    }
    };