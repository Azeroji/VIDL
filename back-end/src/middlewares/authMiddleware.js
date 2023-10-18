import jwt from 'jsonwebtoken';

export default function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, 'bV7Bn^TmEgZ!xQ2c@L#J9W4mKpA&d3G8', (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.userId = decoded.userId;
        next();
    });
}