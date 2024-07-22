// controllers/coupon.controller.ts
import { Request, Response } from 'express';
import CouponService from '../../services/coupon.service';

class CouponController {
    private couponService: CouponService;

    constructor(couponService: CouponService) {
        this.couponService = couponService;
    }

    public createCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupon = await this.couponService.createCoupon(req.body);
            return res.json({ ok: true, coupon });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error creating coupon', error });
        }
    }

    public getCouponById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupon = await this.couponService.getCouponById(req.params.id);
            if (!coupon) {
                return res.status(404).json({ ok: false, message: 'Coupon not found' });
            }
            return res.json({ ok: true, coupon });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching coupon', error });
        }
    }

    public updateCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupon = await this.couponService.updateCoupon(req.params.id, req.body);
            return res.json({ ok: true, coupon });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating coupon', error });
        }
    }

    public deleteCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.couponService.deleteCoupon(req.params.id);
            return res.json({ ok: true, message: 'Coupon deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting coupon', error });
        }
    }

    public getAllCoupons = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupons = await this.couponService.getAllCoupons();
            return res.json({ ok: true, coupons });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching coupons', error });
        }
    }

    public getCouponsByDistributorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupons = await this.couponService.getCouponsByDistributorId(req.user!.id);
            return res.json({ ok: true, coupons });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching distributor coupons', error });
        }
    }

    public getCouponsByClientId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupons = await this.couponService.getCouponsByClientId(req.user!.id);
            return res.json({ ok: true, coupons });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching client coupons', error });
        }
    }
}

export default CouponController;
