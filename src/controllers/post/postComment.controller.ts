import { Request, Response } from 'express';
import PostCommentService from '../../services/postComment.service';

class PostCommentController {
    private postCommentService: PostCommentService;

    constructor(postCommentService: PostCommentService) {
        this.postCommentService = postCommentService;
    }

    public createPostComment = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postComment = await this.postCommentService.createPostComment(req.body);
            return res.json({ ok: true, postComment });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error creating post comment', error });
        }
    }

    public getPostCommentById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postComment = await this.postCommentService.getPostCommentById(req.params.id);
            if (!postComment) {
                return res.status(404).json({ ok: false, message: 'Post comment not found' });
            }
            return res.json({ ok: true, postComment });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching post comment', error });
        }
    }

    public updatePostComment = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postComment = await this.postCommentService.updatePostComment(req.params.id, req.body);
            return res.json({ ok: true, postComment });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating post comment', error });
        }
    }

    public deletePostComment = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.postCommentService.deletePostComment(req.params.id);
            return res.json({ ok: true, message: 'Post comment deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting post comment', error });
        }
    }

    public getAllPostComments = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postComments = await this.postCommentService.getAllPostComments();
            return res.json({ ok: true, postComments });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching post comments', error });
        }
    }
}

export default PostCommentController;
