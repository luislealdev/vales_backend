import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

class UserService {

    public async createUser(user: { select?: Prisma.UserSelect<DefaultArgs> | null | undefined; include?: Prisma.UserInclude<DefaultArgs> | null | undefined; data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>; }): Promise<User | null> {
        return prisma.user.create(user);
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
        })
    }
}

export default UserService;
