// middleware/authorizeCoupon.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authorizeCoupon = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user; // Ahora TypeScript reconoce `req.user`
        const couponId = req.params.id;

        if (!user) {
            return res.status(401).json({ ok: false, message: 'User not authenticated' });
        }

        if (allowedRoles.includes(user.role)) {
            if (user.role === 'ADMIN') {
                return next();
            }

            try {
                const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
                
                if (!coupon) {
                    return res.status(404).json({ ok: false, message: 'Coupon not found' });
                }

                if (user.role === 'DISTRIBUTOR' && coupon.distributor_id === user.id) {
                    return next();
                }

                if (user.role === 'CLIENT' && coupon.client_id === user.id) {
                    return next();
                }

                return res.status(403).json({ ok: false, message: 'Access denied' });
            } catch (error) {
                return res.status(500).json({ ok: false, message: 'Error verifying coupon authorization', error });
            }
        } else {
            return res.status(403).json({ ok: false, message: 'Access denied' });
        }
    };
};

export default authorizeCoupon;
