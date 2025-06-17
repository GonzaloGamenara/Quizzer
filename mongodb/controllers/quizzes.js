class quizzesController{
    contructor(){

    }

    async getAllQuizzes(req, res){
        try{
            res.status(200).json({status:'all-ok'});
        } catch(e){
            res.status(500).send(e);

        }
    }

    async getQuizByName(req, res){
        try{
            res.status(200).json({status:'name-ok'});
        } catch(e){
            res.status(500).send(e);

        }
    }

    async getRandomQuiz(req, res){
        try{
            res.status(200).json({status:'rand-ok'});
        } catch(e){
            res.status(500).send(e);

        }
    }

}

export default new quizzesController();