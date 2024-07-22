import { Router } from 'express';
import NewsPostService from '../services/newsPost.service';
import NewsPostController from '../controllers/post/newsPost.controller';
import authorize from '../middlewares/authorizeRole';

const router = Router();
const newsPostService = new NewsPostService();
const newsPostController = new NewsPostController(newsPostService);

router.post('/news-posts', authorize(['ADMIN', 'EDITOR']), newsPostController.createNewsPost);
router.get('/news-posts/:id', newsPostController.getNewsPostById);
router.put('/news-posts/:id', authorize(['ADMIN', 'EDITOR']), newsPostController.updateNewsPost);
router.delete('/news-posts/:id', authorize(['ADMIN', 'EDITOR']), newsPostController.deleteNewsPost);
router.get('/news-posts', newsPostController.getAllNewsPosts);

export default router;
