// routes/learnPost.routes.ts
import { Router } from 'express';
import LearnPostService from '../services/learnPost.service';
import LearnPostController from '../controllers/post/learnPost.controller';
import authorize from '../middlewares/authorizeRole';

const router = Router();
const learnPostService = new LearnPostService();
const learnPostController = new LearnPostController(learnPostService);

router.post('/learn-posts', authorize(['ADMIN', 'EDITOR']), learnPostController.createLearnPost);
router.get('/learn-posts/:id', learnPostController.getLearnPostById);
router.put('/learn-posts/:id', authorize(['ADMIN', 'EDITOR']), learnPostController.updateLearnPost);
router.delete('/learn-posts/:id', authorize(['ADMIN', 'EDITOR']), learnPostController.deleteLearnPost);
router.get('/learn-posts', learnPostController.getAllLearnPosts);

export default router;
