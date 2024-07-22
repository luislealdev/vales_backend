// middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        const decoded: any = jwt.verify(token!, process.env.JWT_SECRET || '');

        if (roles.includes(decoded.role)) {
            next();
        } else {
            res.status(403).json({ ok: false, message: 'Access denied' });
        }
    };
};

export default authorize;
