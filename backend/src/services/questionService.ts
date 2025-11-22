import { Question } from '../models/types';

export const SAMPLE_QUESTIONS: Question[] = [
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

export class QuestionService {
    static getCategories(): string[] {
        return Array.from(new Set(SAMPLE_QUESTIONS.map(q => q.category)));
    }

    static getQuestionsByCategory(category: string): Question[] {
        return SAMPLE_QUESTIONS.filter(q => q.category === category);
    }

    static getAllQuestions(): Question[] {
        return SAMPLE_QUESTIONS;
    }
}
