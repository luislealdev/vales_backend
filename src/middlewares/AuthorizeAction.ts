import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authorizeAction = (roles: string[], model: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) return res.status(401).json({
            ok: false,
            message: "User doesn't exists in request"
        })

        const userRole = req.user.role;
        const userId = req.user.id;
        const { id } = req.params;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ ok: false, message: 'Access denied.' });
        }

        try {
            let record;
            switch (model) {
                case 'PostComment':
                    record = await prisma.postComment.findUnique({ where: { id } });
                    break;
                case 'PostLike':
                    record = await prisma.postLike.findUnique({ where: { id } });
                    break;
                default:
                    return res.status(400).json({ ok: false, message: 'Invalid model.' });
            }

            if (!record) {
                return res.status(404).json({ ok: false, message: `${model} not found.` });
            }

            if (record.user_id !== userId && !['ADMIN', 'WRITER'].includes(userRole)) {
                return res.status(403).json({ ok: false, message: 'Not authorized to perform this action.' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error checking authorization.', error });
        }
    };
};

export default authorizeAction;
