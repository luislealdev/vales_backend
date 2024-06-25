import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { generateRandomPassword } from '../../utils/generateRandomPassword';

export const createUser = async (req: Request, res: Response) => {
    const { email, name, second_name, first_lastName, second_lastName, phone, birthdate, score, rfc, curp, gender, street, number, neighborhood, city, state, zip_code } = req.body;

    // Validación de entrada
    if (!email || !name || !first_lastName || !second_lastName || !phone || !birthdate || !rfc || !curp || !gender || !street || !number || !neighborhood || !city || !state || !zip_code) {
        return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificación de duplicados
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ ok: false, message: 'El correo electrónico ya está registrado' });
        }

        const pass = generateRandomPassword();
        // TODO: IMPLEMENT HASHING PASSWORD
        // const hashedPass = bcrypt.hashSync(pass, 10);

        // Transacción para crear usuario y dirección
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    password: pass,
                    email: email,
                    role: 'CLIENT',
                    userInfo: {
                        create: {
                            name,
                            second_name,
                            first_lastName,
                            second_lastName,
                            phone,
                            birthdate: new Date(birthdate),
                            score,
                            rfc,
                            curp,
                            gender,
                            address: {
                                create: {
                                    street,
                                    number,
                                    neighborhood,
                                    city,
                                    state,
                                    zip_code,
                                    // Add the user relationship here
                                    user: {
                                        connect: { email: email } // Connect to the user using email
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // TODO: SEND EMAIL WITH PASSWORD
            return user;
        });


        return res.status(201).json({ ok: true, user: result });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Manejo de errores conocidos de Prisma
            return res.status(500).json({ ok: false, message: 'Error en el servidor o datos incorrectos', error: error.message });
        }
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido, revise la consola del sistema' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    // Validación de entrada
    if (!user_id) {
        return res.status(400).json({ ok: false, message: 'El ID del usuario es obligatorio' });
    }

    try {
        // Verificar si el usuario tiene cupones
        const userWithCoupons = await prisma.coupon.findFirst({
            where: {
                OR: [
                    { distributorId: user_id },
                    { clientId: user_id }
                ]
            }
        });

        if (userWithCoupons) {
            // Si el usuario tiene cupones, cambiar is_active a false
            const updatedUser = await prisma.user.update({
                where: { id: user_id },
                data: { is_active: false }
            });

            return res.status(200).json({ ok: true, message: 'El usuario tiene cupones, se ha desactivado en lugar de eliminarse', user: updatedUser });
        } else {
            // Iniciar transacción para eliminar todo lo relacionado con el usuario
            await prisma.$transaction(async (prisma) => {
                // Eliminar dirección del usuario
                await prisma.address.deleteMany({
                    where: {
                        user: {
                            id: user_id
                        }
                    }
                });

                // Eliminar información del usuario
                await prisma.userInfo.deleteMany({
                    where: { user_id }
                });

                // Eliminar el usuario
                await prisma.user.delete({
                    where: { id: user_id }
                });
            });

            return res.status(200).json({ ok: true, message: 'Usuario y toda la información relacionada han sido eliminados' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Error desconocido, revise la consola del sistema' });
    }
};
