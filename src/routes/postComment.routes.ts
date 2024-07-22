import { Router } from 'express';
import PostCommentService from '../services/postComment.service';
import PostCommentController from '../controllers/post/postComment.controller';
import authorizeAction from '../middlewares/AuthorizeAction';

const router = Router();
const postCommentService = new PostCommentService();
const postCommentController = new PostCommentController(postCommentService);

router.post('/post-comments', postCommentController.createPostComment);
router.get('/post-comments/:id', postCommentController.getPostCommentById);
router.put('/post-comments/:id', authorizeAction(['ADMIN', 'WRITER', 'CLIENT'], 'PostComment'), postCommentController.updatePostComment);
router.delete('/post-comments/:id', authorizeAction(['ADMIN', 'WRITER', 'CLIENT'], 'PostComment'), postCommentController.deletePostComment);

export default router;
