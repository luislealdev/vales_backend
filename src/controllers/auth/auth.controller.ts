import { Request, Response } from 'express';
import AuthService from '../../services/auth.service';

class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public login = async (req: Request, res: Response): Promise<Response> => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ ok: false, message: 'El correo y la contraseña son obligatorios' });
        }

        try {
            const loginResponse = await this.authService.login(email, password);
            return res.json(loginResponse);
        } catch (error: any) {
            return res.status(error.status || 500).json({ ok: false, message: error.message || 'Error desconocido al iniciar sesión' });
        }
    }

    public checkAuthStatus = async (req: Request, res: Response): Promise<Response> => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ ok: false, message: 'Token no proporcionado' });
        }

        try {
            const authStatusResponse = await this.authService.checkAuthStatus(token);            
            return res.json(authStatusResponse);
        } catch (error: any) {
            return res.status(error.status || 401).json({ ok: false, message: error.message || 'Token no válido' });
        }
    }
}

export default AuthController;
