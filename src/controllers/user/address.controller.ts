import { Request, Response } from 'express';
import prisma from '../../lib/prisma';

export const createAddress = async (req: Request, res: Response) => {
    const { street, number, neighborhood, city, state, zip_code, user_id } = req.body;

    // Validación de entrada
    if (!street || !number || !neighborhood || !city || !state || !zip_code || !user_id) {
        return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        const storedAddress = await prisma.address.create({
            data: {
                street,
                number,
                neighborhood,
                city,
                state,
                zip_code,
                user: { connect: { id: user_id } }
            }
        });
        return res.status(201).json({ ok: true, address: storedAddress });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido al crear la dirección, revise la consola del sistema' });
    }
};


export const getAddress = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    // Validación de entrada
    if (!user_id) {
        return res.status(400).json({ ok: false, message: 'El ID del usuario es obligatorio' });
    }

    try {
        const address = await prisma.address.findUnique({
            where: { user_id }
        });

        if (!address) {
            return res.status(404).json({ ok: false, message: 'Dirección no encontrada' });
        }

        return res.json({ ok: true, address });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido al obtener la dirección, revise la consola del sistema' });
    }
};


export const updateAddress = async (req: Request, res: Response) => {
    const { street, number, neighborhood, city, state, zip_code } = req.body;
    const { user_id } = req.params;

    // Validación de entrada
    if (!user_id) {
        return res.status(400).json({ ok: false, message: 'El ID del usuario es obligatorio' });
    }

    if (!street && !number && !neighborhood && !city && !state && !zip_code) {
        return res.status(400).json({ ok: false, message: 'Al menos un campo debe ser actualizado' });
    }

    try {
        const address = await prisma.address.findUnique({
            where: { user_id }
        });

        if (!address) {
            return res.status(404).json({ ok: false, message: 'Dirección no encontrada' });
        }

        const updatedAddress = await prisma.address.update({
            where: { user_id },
            data: {
                street,
                number,
                neighborhood,
                city,
                state,
                zip_code
            }
        });

        return res.json({ ok: true, address: updatedAddress });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido al actualizar la dirección, revise la consola del sistema' });
    }
};
