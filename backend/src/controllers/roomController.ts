import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';

export class RoomController {
    static getCategories(req: Request, res: Response) {
        const categories = QuestionService.getCategories();
        res.json(categories);
    }

    static getSampleQuestions(req: Request, res: Response) {
        const { category } = req.query;
        if (typeof category === 'string') {
            const questions = QuestionService.getQuestionsByCategory(category);
            res.json(questions);
        } else {
            res.status(400).json({ error: 'Category required' });
        }
    }
}
