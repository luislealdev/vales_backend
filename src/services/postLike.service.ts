import { PrismaClient, PostLike } from '@prisma/client';

const prisma = new PrismaClient();

class PostLikeService {
    public async createPostLike(data: PostLike, userId: string): Promise<PostLike> {
        return prisma.postLike.create({
            data: {
                ...data,
                user_id: userId,
            },
        });
    }

    public async getPostLikeById(id: string): Promise<PostLike | null> {
        return prisma.postLike.findUnique({ where: { id } });
    }

    public async deletePostLike(id: string): Promise<void> {
        await prisma.postLike.delete({ where: { id } });
    }
}

export default PostLikeService;
