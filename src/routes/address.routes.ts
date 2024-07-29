import { Router } from "express";

import AddressService from '../services/address.service';
import AddressController from '../controllers/user/address.controller';

const router = Router();
const addressService = new AddressService();
const addressController = new AddressController(addressService);

router.get('/address', addressController.getAddress);

export default router;