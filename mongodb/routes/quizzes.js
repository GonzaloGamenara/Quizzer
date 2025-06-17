import express from 'express';
const route = express.Router();
import quizzesController from '../controllers/quizzes.js';

route.get('/',quizzesController.getAllQuizzes);
route.get('/random',quizzesController.getRandomQuiz);
route.get('/:name',quizzesController.getQuizById);


export default route;