const Question = require('../models/question');

/*exports.createQuestion = async(req, res) => {
    try{
    const question = await Question.create(req.body);
    res.status(201).json(question);
    }catch(error){
        res.status(400).json({ message: error.message});
    }
};

exports.getAllQuestions = async(req, res) => {
    try{
        const questions = await Question.find();
        res.status(200).json(questions);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

exports.getQuestionById = async (req, res) => {
    try{
        const question = await Question.findById(req.params.id);
        if(!question){
            return res.status(404).json({ message: "Question non trouvée!"});    
        }
        res.status(200).json(question);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try{
        const { id } = req.params;
        const question = await Question.findByIdAndUpdate(id, req.body, { new: true});
        if (!question) {
            return res.status(404).json({ message: "Question non trouvée!" });
        }
        res.status(200).json(question);
    }catch(error){
        res.status(404).json({ message: error.message});
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByIdAndDelete(id);
        if (!question) {
            return res.status(404).json({ message: "Question non trouvée!" });
        }
        res.status(204).json({ message: "Question supprimée !"});
    }catch(error){
        res.status(404).json({ message: error.message});
    }
};*/

