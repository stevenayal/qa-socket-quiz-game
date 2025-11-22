"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const questionService_1 = require("../services/questionService");
class RoomController {
    static getCategories(req, res) {
        const categories = questionService_1.QuestionService.getCategories();
        res.json(categories);
    }
    static getSampleQuestions(req, res) {
        const { category } = req.query;
        if (typeof category === 'string') {
            const questions = questionService_1.QuestionService.getQuestionsByCategory(category);
            res.json(questions);
        }
        else {
            res.status(400).json({ error: 'Category required' });
        }
    }
}
exports.RoomController = RoomController;
