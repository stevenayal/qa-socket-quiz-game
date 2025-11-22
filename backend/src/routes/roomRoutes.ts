import { Router } from 'express';
import { RoomController } from '../controllers/roomController';

const router = Router();

router.get('/questions/categories', RoomController.getCategories);
router.get('/questions/sample', RoomController.getSampleQuestions);

export default router;
