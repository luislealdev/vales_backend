// services/coupon.service.ts
import { Coupon, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CouponService {
    public async createCoupon(data: any) {
        return await prisma.coupon.create({ data });
    }

    public async getCouponById(id: string) {
        return await prisma.coupon.findUnique({ where: { id } });
    }

    public async updateCoupon(id: string, data: Coupon) {
        return await prisma.coupon.update({ where: { id }, data });
    }

    public async deleteCoupon(id: string) {
        return await prisma.coupon.delete({ where: { id } });
    }

    public async getAllCoupons() {
        return await prisma.coupon.findMany();
    }

    public async getCouponsByDistributorId(distributorId: string) {
        return await prisma.coupon.findMany({ where: { distributor_id: distributorId } });
    }

    public async getCouponsByClientId(clientId: string) {
        return await prisma.coupon.findMany({ where: { client_id: clientId } });
    }
}

export default CouponService;
