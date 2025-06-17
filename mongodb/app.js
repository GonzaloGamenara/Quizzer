import 'dotenv/config';
import express from 'express';
import routesQuizzes from './routes/quizzes.js';

const app = express();

app.use('/quizzes', routesQuizzes);

try{
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}catch(e){
    console.log(e)
}