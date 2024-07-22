import prisma from "../lib/prisma";

class NewsPostService {
    public async createNewsPost(data: any) {
        return prisma.newsPost.create({ data });
    }

    public async getNewsPostById(id: string) {
        return prisma.newsPost.findUnique({
            where: { id },
            include: { user: true, post_comments: true, post_likes: true }
        });
    }

    public async updateNewsPost(id: string, data: any) {
        return prisma.newsPost.update({
            where: { id },
            data
        });
    }

    public async deleteNewsPost(id: string) {
        return prisma.newsPost.delete({
            where: { id }
        });
    }

    public async getAllNewsPosts() {
        return prisma.newsPost.findMany({
            include: { user: true, post_comments: true, post_likes: true }
        });
    }

    public async getRecentNewsPosts() {
        return prisma.newsPost.findMany({
            include: { user: true, post_comments: true, post_likes: true },
            take: 5
        })
    }
}

export default NewsPostService;
