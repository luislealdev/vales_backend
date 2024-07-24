import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authorizeUser = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) return res.status(401).json({
            ok: false,
            message: "User doesn't exist in request"
        });

        const userRole = req.user.role;
        const userId = req.user.id;
        const { id } = req.params;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ ok: false, message: 'Access denied.' });
        }

        try {
            if (userRole === 'ADMIN') {
                return next();
            }

            if (userRole === 'EDITOR') {
                if (userId === id) {
                    return next();
                } else {
                    return res.status(403).json({ ok: false, message: 'Not authorized to perform this action.' });
                }
            }

            if (userRole === 'DISTRIBUTOR') {
                if (userId === id) {
                    return next();
                }

                // Check if this is a user creation endpoint
                if (req.method === 'POST' && req.path === '/users') {
                    // Distributors are allowed to create new users
                    return next();
                }

                // For other actions, check received coupons
                const client = await prisma.user.findUnique({
                    where: { id },
                    include: {
                        received_coupons: {
                            where: { distributor_id: userId }
                        }
                    }
                });

                if (client && client.received_coupons.length > 0) {
                    return next();
                } else {
                    return res.status(403).json({ ok: false, message: 'Not authorized to perform this action.' });
                }
            }

            return res.status(403).json({ ok: false, message: 'Access denied.' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error checking authorization.', error });
        }
    };
};

export default authorizeUser;
