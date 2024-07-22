import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { Gender, Role } from '@prisma/client';
import { validateEmail } from '../../utils/validateEmail';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        // Validate required fields for user creation
        const requiredUserFields = ['email', 'password', 'role'];
        for (const field of requiredUserFields) {
            if (!req.body[field]) {
                return res.status(400).json({ ok: false, message: `Missing required field: ${field}` });
            }
        }

        // Validate email format
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({ ok: false, message: 'Invalid email format' });
        }

        // Validate password strength (optional)
        // You can use a password validation library or implement your own rules

        // Validate role
        if (!Object.values(Role).includes(req.body.role)) {
            return res.status(400).json({ ok: false, message: 'Invalid role' });
        }

        // Extract user_info data from request body
        const userInfoData = {
            name: req.body.name || '',
            secondName: req.body.secondName || '',
            firstNameLastName: req.body.firstNameLastName || '',
            secondLastName: req.body.secondLastName || '',
            phone: req.body.phone || '',
            birthdate: req.body.birthdate || null,
            score: req.body.score || 0,
            rfc: req.body.rfc || '',
            curp: req.body.curp || '',
            gender: req.body.gender || Gender.MALE,
        };

        // Create the user object with user_info
        const userObject = {
            ...req.body, // Include other user fields
            user_info: userInfoData, // Add user_info data
        };

        // Attempt to create the user using the userService
        try {
            const user = await this.userService.createUser(userObject);
            return res.json({ ok: true, user });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error while creating user', error });
        }
    }


    public getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ ok: false, message: 'User not found' });
            }
            return res.json({ ok: true, user });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching user', error });
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            return res.json({ ok: true, user });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating user', error });
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.userService.deleteUser(req.params.id);
            return res.json({ ok: true, message: 'User deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting user', error });
        }
    }

    public getDistributors = async (req: Request, res: Response): Promise<Response> => {
        try {
            const distributors = await this.userService.getDistributors();
            return res.json({ ok: true, distributors })
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error getting distributors', error });
        }
    }
}

export default UserController;
