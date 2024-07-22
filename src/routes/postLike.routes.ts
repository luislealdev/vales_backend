import { Router } from 'express';
import PostLikeService from '../services/postLike.service';
import PostLikeController from '../controllers/post/postLike.controller';
import authorizeAction from '../middlewares/AuthorizeAction';

const router = Router();
const postLikeService = new PostLikeService();
const postLikeController = new PostLikeController(postLikeService);

router.post('/post-likes', postLikeController.createPostLike);
router.get('/post-likes/:id', postLikeController.getPostLikeById);
router.delete('/post-likes/:id', authorizeAction(['ADMIN', 'WRITER', 'CLIENT'], 'PostLike'), postLikeController.deletePostLike);

export default router;
