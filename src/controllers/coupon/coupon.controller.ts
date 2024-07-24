// controllers/coupon.controller.ts
import { Request, Response } from 'express';
import CouponService from '../../services/coupon.service';
import { generateCouponCode } from '../../utils/generateRandomCode';
import { format, parse } from 'date-fns';

class CouponController {
    private couponService: CouponService;

    constructor(couponService: CouponService) {
        this.couponService = couponService;
    }

    public createCoupon = async (req: Request, res: Response): Promise<Response> => {

        const requiredFields = ['amount', 'expires_at', 'months_to_pay', 'client_id'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ ok: false, message: `Missing required field: ${field}` });
            }
        }

        const expires_at_string = req.body.expires_at;
        let expires_at: Date;

        try {
            const parsedDate = parse(expires_at_string, 'dd-MM-yyyy', new Date());
            expires_at = new Date(format(parsedDate, 'yyyy-MM-dd'));
        } catch (error) {
            return res.status(400).json({ ok: false, message: 'Invalid expires_at format (must be dd-MM-yyyy)' });
        }

        const couponInfo = {
            amount: req.body.amount,
            expires_at,
            months_to_pay: req.body.months_to_pay,
            client_id: req.body.client_id,
            distributor_id: req.user!.id,
            code: generateCouponCode(),
        }

        try {
            const coupon = await this.couponService.createCoupon(couponInfo);
            return res.json({ ok: true, coupon });
        } catch (error) {
            console.log(error);
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
