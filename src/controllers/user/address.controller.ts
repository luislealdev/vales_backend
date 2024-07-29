import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
import AddressService from '../../services/address.service';

class AddressController {
    private addressService: AddressService;

    constructor(userService: AddressService) {
        this.addressService = userService;
    }

    public getAddress = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.user!;

        if (!id) {
            return res.status(400).json({ ok: false, message: 'Missing required field: id' });
        }

        const address = await this.addressService.getAddressByUserId(id);

        if (!address) {
            return res.status(404).json({ ok: false, message: 'Address not found' });
        }

        return res.status(200).json({ ok: true, address });
    }
}


export default AddressController;