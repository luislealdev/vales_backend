import prisma from "../../lib/prisma";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../../interfaces";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ ok: false, message: 'El correo y la contraseña son obligatorios' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userInfo: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
        }

        const valid = user.password === password;
        // TODO: CHECK HASHED PASSWORD
        // const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(400).json({ ok: false, message: 'Contraseña incorrecta' });
        }

        if (!user.is_active) {
            return res.status(403).json({ ok: false, message: 'Cuenta desactivada. Por favor, contacte al administrador.' });
        }

        const token = jwt.sign({ user_id: user.id, role: user.role, is_active: user.is_active }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        return res.json({ ok: true, id: user.id, email: user.email, role: user.role, name: user.userInfo?.name, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido al iniciar sesión, revise la consola del sistema' });
    }
}


export const checkAuthStatus = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ ok: false, message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        const userId = decoded.user_id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                userInfo: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
        }

        if (!user.is_active) {
            return res.status(403).json({ ok: false, message: 'Cuenta desactivada. Por favor, contacte al administrador.' });
        }

        return res.json({
            ok: true,
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.userInfo?.name,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ ok: false, message: 'Token no válido' });
    }
}
