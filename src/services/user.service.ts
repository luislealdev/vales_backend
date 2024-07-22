import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class UserService {

    public async createUser(data: {
        email: string;
        password: string;
        user_info: {
            name: string;
            second_name: string;
            first_last_name: string;
            second_last_name: string;
            phone: string;
            birthdate: Date;
            score: number;
            rfc: string;
            curp: string;
            gender: 'MALE' | 'FEMALE';
        };
        address: {
            street: string;
            number: string;
            neighborhood: string;
            city: string;
            state: string;
            zip_code: string;
        }
    }): Promise<User> {

        try {
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    user_info: {
                        create: {
                            ...data.user_info
                        }
                    },
                    address: {
                        create: {
                            ...data.address
                        }
                    }
                },
                include: {
                    user_info: true,
                    address: true
                }
            });

            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    public async updateUser(id: string, data: Partial<User>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    public async deleteUser(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
    }

    public async getDistributors(): Promise<User[] | null> {
        return prisma.user.findMany({
            where: {
                role: 'DISTRIBUTOR'
            }
        });
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }
}

export default UserService;
