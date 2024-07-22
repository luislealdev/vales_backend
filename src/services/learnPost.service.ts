import prisma from "../lib/prisma";

class LearnPostService {
    public async createLearnPost(data: any) {
        return prisma.learnPost.create({ data });
    }

    public async getLearnPostById(id: string) {
        return prisma.learnPost.findUnique({
            where: { id },
            include: { user: true }
        });
    }

    public async updateLearnPost(id: string, data: any) {
        return prisma.learnPost.update({
            where: { id },
            data
        });
    }

    public async deleteLearnPost(id: string) {
        return prisma.learnPost.delete({
            where: { id }
        });
    }

    public async getAllLearnPosts() {
        return prisma.learnPost.findMany({
            include: { user: true }
        });
    }
}

export default LearnPostService;
