const mongoose = require('mongoose');


const learningResourceSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const LearningResource = mongoose.model('LearningResource', learningResourceSchema);

module.exports = LearningResource;