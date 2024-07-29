import { Router } from 'express';
import UserService from '../services/user.service';
import UserController from '../controllers/user/user.controller';
import authorizeUser from '../middlewares/authorizeUser';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.get('/users/distributors', authorizeUser(['ADMIN']), userController.getDistributors);
router.post('/users', authorizeUser(['ADMIN', 'DISTRIBUTOR']), userController.createUser);
// router.get('/users/:id', userController.getUserById);
router.get('/user-info', userController.getUserInfoByUserId);
router.put('/users/:id', authorizeUser(['ADMIN', 'WRITER', 'DISTRIBUTOR']), userController.updateUser);
router.delete('/users/:id', authorizeUser(['ADMIN', 'WRITER', 'DISTRIBUTOR']), userController.deleteUser);
router.get('/clients', authorizeUser(['DISTRIBUTOR']), userController.getClients);

export default router;
