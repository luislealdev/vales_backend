import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
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

// export const disableUser = async (req: Request, res: Response) => {
//     const { email } = req.params;

//     try {
//         const user = await prisma.user.update({
//             where: { email },
//             data: {
//                 is_active: false
//             }
//         });

//         return res.json({ ok: true, user });
//     } catch (error) {
//         return res.status(500).json({ ok: false, message: 'Error desconocido', error: error.message });
//     }
// }