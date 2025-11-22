"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = exports.SAMPLE_QUESTIONS = void 0;
exports.SAMPLE_QUESTIONS = [
    {
        id: 'q1',
        category: 'fundamentos_qa',
        text: '¿Qué significa QA?',
        options: ['Quality Assets', 'Quality Assurance', 'Quick Action', 'Quality Analysis'],
        correctOptionIndex: 1,
        explanation: 'QA significa Quality Assurance (Aseguramiento de Calidad).'
    },
    {
        id: 'q2',
        category: 'fundamentos_qa',
        text: '¿Cuál NO es un tipo de prueba funcional?',
        options: ['Prueba de carga', 'Prueba unitaria', 'Prueba de integración', 'Prueba de sistema'],
        correctOptionIndex: 0,
        explanation: 'Las pruebas de carga son pruebas no funcionales (rendimiento).'
    },
    {
        id: 'q3',
        category: 'automatizacion',
        text: '¿Qué herramienta se usa comúnmente para automatizar navegadores?',
        options: ['Postman', 'Selenium', 'Jira', 'Docker'],
        correctOptionIndex: 1,
        explanation: 'Selenium es una herramienta popular para la automatización de navegadores web.'
    },
    {
        id: 'q4',
        category: 'api_testing',
        text: '¿Qué código HTTP indica éxito?',
        options: ['404', '500', '200', '301'],
        correctOptionIndex: 2,
        explanation: '200 OK es el código estándar para respuestas exitosas.'
    }
];
class QuestionService {
    static getCategories() {
        return Array.from(new Set(exports.SAMPLE_QUESTIONS.map(q => q.category)));
    }
    static getQuestionsByCategory(category) {
        return exports.SAMPLE_QUESTIONS.filter(q => q.category === category);
    }
    static getAllQuestions() {
        return exports.SAMPLE_QUESTIONS;
    }
}
exports.QuestionService = QuestionService;
