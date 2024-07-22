import { Request, Response } from 'express';
import LearnPostService from '../../services/learnPost.service';

class LearnPostController {
    private learnPostService: LearnPostService;

    constructor(learnPostService: LearnPostService) {
        this.learnPostService = learnPostService;
    }

    public createLearnPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            const learnPost = await this.learnPostService.createLearnPost(req.body);
            return res.json({ ok: true, learnPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error creating learn post', error });
        }
    }

    public getLearnPostById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const learnPost = await this.learnPostService.getLearnPostById(req.params.id);
            if (!learnPost) {
                return res.status(404).json({ ok: false, message: 'Learn post not found' });
            }
            return res.json({ ok: true, learnPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching learn post', error });
        }
    }

    public updateLearnPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            const learnPost = await this.learnPostService.updateLearnPost(req.params.id, req.body);
            return res.json({ ok: true, learnPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating learn post', error });
        }
    }

    public deleteLearnPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.learnPostService.deleteLearnPost(req.params.id);
            return res.json({ ok: true, message: 'Learn post deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting learn post', error });
        }
    }

    public getAllLearnPosts = async (req: Request, res: Response): Promise<Response> => {
        try {
            const learnPosts = await this.learnPostService.getAllLearnPosts();
            return res.json({ ok: true, learnPosts });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching learn posts', error });
        }
    }
}

export default LearnPostController;
