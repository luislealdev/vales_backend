import { Request, Response } from 'express';
import NewsPostService from '../../services/newsPost.service';

class NewsPostController {
    private newsPostService: NewsPostService;

    constructor(newsPostService: NewsPostService) {
        this.newsPostService = newsPostService;
    }

    public createNewsPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newsPost = await this.newsPostService.createNewsPost(req.body);
            return res.json({ ok: true, newsPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error creating news post', error });
        }
    }

    public getNewsPostById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newsPost = await this.newsPostService.getNewsPostById(req.params.id);
            if (!newsPost) {
                return res.status(404).json({ ok: false, message: 'News post not found' });
            }
            return res.json({ ok: true, newsPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching news post', error });
        }
    }

    public updateNewsPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newsPost = await this.newsPostService.updateNewsPost(req.params.id, req.body);
            return res.json({ ok: true, newsPost });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error updating news post', error });
        }
    }

    public deleteNewsPost = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.newsPostService.deleteNewsPost(req.params.id);
            return res.json({ ok: true, message: 'News post deleted' });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error deleting news post', error });
        }
    }

    public getAllNewsPosts = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newsPosts = await this.newsPostService.getAllNewsPosts();
            return res.json({ ok: true, newsPosts });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching news posts', error });
        }
    }

    public getRecentNewsPosts = async (req: Request, res: Response): Promise<Response> => {
        try {
            const recentPosts = await this.newsPostService.getRecentPosts();
            return res.json({ ok: true, recentPosts });
        } catch (error) {
            return res.status(500).json({ ok: false, message: 'Error fetching recent news posts' });
        }
    }
}

export default NewsPostController;
