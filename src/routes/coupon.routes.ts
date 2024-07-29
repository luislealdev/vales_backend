// routes/coupon.routes.ts
import { Router } from 'express';
import CouponService from '../services/coupon.service';
import CouponController from '../controllers/coupon/coupon.controller';
import authorizeCoupon from '../middlewares/authorizeCoupon';

const router = Router();
const couponService = new CouponService();
const couponController = new CouponController(couponService);

router.post('/coupons', authorizeCoupon(['DISTRIBUTOR']), couponController.createCoupon);
router.get('/coupons/:id', authorizeCoupon(['ADMIN', 'DISTRIBUTOR', 'CLIENT']), couponController.getCouponById);
router.put('/coupons/:id', authorizeCoupon(['ADMIN', 'DISTRIBUTOR']), couponController.updateCoupon);
router.delete('/coupons/:id', authorizeCoupon(['ADMIN', 'DISTRIBUTOR']), couponController.deleteCoupon);
router.get('/coupons', couponController.getAllCoupons);
// router.get('/coupons/distributor', authorizeCoupon(['DISTRIBUTOR']), couponController.getCouponsByDistributorId);
// router.get('/coupons/client', authorizeCoupon(['CLIENT']), couponController.getCouponsByClientId);


export default router;
