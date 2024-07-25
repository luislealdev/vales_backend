import prisma from "../lib/prisma";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthService {
    public async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw { status: 400, message: 'Contraseña incorrecta' };
        }

        if (!user.is_active) {
            throw { status: 403, message: 'Cuenta desactivada. Por favor, contacte al administrador.' };
        }

        const token = jwt.sign({ user_id: user.id, role: user.role, is_active: user.is_active }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        return {
            ok: true,
            token,
            role: user.role,
            isActive: user.is_active
        };
    }

    public async checkAuthStatus(token: string) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        const userId = decoded.user_id;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        if (!user.is_active) {
            throw { status: 403, message: 'Cuenta desactivada. Por favor, contacte al administrador.' };
        }


        const newToken = jwt.sign({ user_id: user.id, role: user.role, is_active: user.is_active }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        return {
            ok: true,
            isActive: user.is_active,
            role: user.role,
            token: newToken
        };
    }
}

export default AuthService;
