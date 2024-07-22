// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (req.originalUrl == '/auth/login') next();

    if (!token) {
        return res.status(401).json({ ok: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await prisma.user.findUnique({ where: { id: decoded.user_id } });
        if (!user) {
            return res.status(401).json({ ok: false, message: 'Invalid token.' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ ok: false, message: 'Invalid token.' });
    }
};

export default authenticate;
