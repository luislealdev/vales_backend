import { Request, Response } from 'express';
import PostLikeService from '../../services/postLike.service';

class PostLikeController {
    private postLikeService: PostLikeService;

    constructor(postLikeService: PostLikeService) {
        this.postLikeService = postLikeService;
    }

    public createPostLike = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postLike = await this.postLikeService.createPostLike(req.body);
            return res.json({ ok: true, postLike });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error creating post like', error });
        }
    }

    public getPostLikeById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postLike = await this.postLikeService.getPostLikeById(req.params.id);
            if (!postLike) {
                return res.status(404).json({ ok: false, message: 'Post like not found' });
            }
            return res.json({ ok: true, postLike });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching post like', error });
        }
    }

    public updatePostLike = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postLike = await this.postLikeService.updatePostLike(req.params.id, req.body);
            return res.json({ ok: true, postLike });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating post like', error });
        }
    }

    public deletePostLike = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.postLikeService.deletePostLike(req.params.id);
            return res.json({ ok: true, message: 'Post like deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting post like', error });
        }
    }

    public getAllPostLikes = async (req: Request, res: Response): Promise<Response> => {
        try {
            const postLikes = await this.postLikeService.getAllPostLikes();
            return res.json({ ok: true, postLikes });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching post likes', error });
        }
    }
}

export default PostLikeController;
