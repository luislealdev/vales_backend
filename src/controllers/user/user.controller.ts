import { parse, format } from 'date-fns';
import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { Gender } from '@prisma/client';
import { validateEmail } from '../../utils/validateEmail';
import { generateRandomPassword } from '../../utils/generateRandomPassword';
import bcrypt from 'bcrypt';
import sendEmail from '../../helpers/send-email';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }


    public createUser = async (req: Request, res: Response): Promise<Response> => {
        // Validate required fields for user creation
        const requiredUserFields = [
            'email',
            'name',
            'second_name',
            'phone',
            'birthdate',
            'rfc',
            'curp',
            'gender',
            'first_last_name',
            'second_last_name',
            'street',
            'number',
            'neighborhood',
            'city',
            'state',
            'zip_code'
        ];

        const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}(?:\d{2})?([A-Z\d]{3})?$/;
        const CURP_REGEX = /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/;

        for (const field of requiredUserFields) {
            if (!req.body[field]) {
                return res.status(400).json({ ok: false, message: `Missing required field: ${field}` });
            }
        }

        // Validate email format
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({ ok: false, message: 'Invalid email format' });
        }

        const userExists = await this.userService.getUserByEmail(req.body.email);
        if (userExists) {
            return res.status(400).json({ ok: false, message: 'User already exists' });
        }

        // Validate RFC
        if (!RFC_REGEX.test(req.body.rfc)) return res.status(400).json({
            ok: false,
            message: 'RFC not valid'
        });
        // Validate CURP
        if (!CURP_REGEX.test(req.body.curp)) return res.status(400).json({
            ok: false,
            message: 'CURP not valid'
        });

        if (req.body.phone.length != 10) return res.status(400).json({ ok: false, message: 'Invalid phone number' });

        const birthdateString = req.body.birthdate;
        let birthdate: Date;

        if (birthdateString) {
            try {
                const parsedDate = parse(birthdateString, 'dd-MM-yyyy', new Date());
                birthdate = new Date(format(parsedDate, 'yyyy-MM-dd'));
            } catch (error) {
                return res.status(400).json({ ok: false, message: 'Invalid birthdate format' });
            }
        }

        const password = generateRandomPassword();

        // Email content for user
        const userEmailHtml = `
        <h2>¡Bienvenido a Más Óptica, ${req.body.name} ${req.body.first_last_name}!</h2>
        <p>Nos complace darte la bienvenida a nuestra plataforma. Aquí tienes los detalles para acceder a tu cuenta:</p>
        <ul>
          <li><b>Email:</b> ${req.body.email}</li>
          <li><b>Contraseña:</b> ${password}</li>
        </ul>
        <p>Por favor, accede a tu cuenta y cambia tu contraseña lo antes posible.</p>
        <p>¡Gracias por unirte a nosotros!</p>
      `;

        await sendEmail(req.body.email, 'Bienvenido a Más Óptica', userEmailHtml);

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Extract user_info data from request body 
        const userInfoData = {
            name: req.body.name || '',
            second_name: req.body.second_name || '',
            first_last_name: req.body.first_last_name || '',
            second_last_name: req.body.second_last_name || '',
            phone: req.body.phone || '',
            birthdate: birthdate!,
            score: req.body.score || 0,
            rfc: req.body.rfc || '',
            curp: req.body.curp || '',
            gender: req.body.gender || Gender.MALE,
        };

        const userAddress = {
            street: req.body.street || '',
            number: req.body.number || '',
            neighborhood: req.body.neighborhood || '',
            city: req.body.city || '',
            state: req.body.state || '',
            zip_code: req.body.zip_code
        }

        // Create the user object with user_info
        const userObject = {
            created_by: req.user!.id,
            updated_at: new Date(),
            email: req.body.email,
            password: hashedPassword,
            user_info: userInfoData, // Add user_info data
            address: userAddress,
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
            const user = await this.userService.getUserById(req.user!.id);
            if (!user) {
                return res.status(404).json({ ok: false, message: 'User not found' });
            }

            return res.json({
                ok: true, user: {
                    ...user,
                    password: undefined
                }
            });

        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching user', error });
        }
    }

    public getUserInfoByUserId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await this.userService.getUserInfoByUserId(req.user!.id);
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

    public getClients = async (req: Request, res: Response): Promise<Response> => {
        try {
            const clients = await this.userService.getClients(req.user!.id);
            return res.json({ ok: true, clients });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error getting clients', error });
        }
    }
}

export default UserController;
