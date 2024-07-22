import { PrismaClient, PostComment } from '@prisma/client';

const prisma = new PrismaClient();

class PostCommentService {
    public async createPostComment(data: PostComment, userId: string): Promise<PostComment> {
        return prisma.postComment.create({
            data: {
                ...data,
                user_id: userId,
            },
        });
    }

    public async getPostCommentById(id: string): Promise<PostComment | null> {
        return prisma.postComment.findUnique({ where: { id } });
    }

    public async updatePostComment(id: string, data: PostComment): Promise<PostComment> {
        return prisma.postComment.update({
            where: { id },
            data,
        });
    }

    public async deletePostComment(id: string): Promise<void> {
        await prisma.postComment.delete({ where: { id } });
    }
}

export default PostCommentService;
