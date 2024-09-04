const LearningResource = require('../models/learningResource');
const Course = require('../models/course');
const { DeepL } = require('deepl');

exports.addResourceToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { sectionIndex, name, description, fileUrl } = req.body;

        console.log('Adding resource to course:', courseId, sectionIndex, name, description, fileUrl);

        // Recherchez le cours par son ID
        const course = await Course.findById(courseId);

        // Vérifiez si le cours existe
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Vérifiez si la section spécifiée existe
        if (sectionIndex < 0 || sectionIndex >= course.sections.length) {
            return res.status(400).json({ message: 'Invalid section index' });
        }

        // Créez une nouvelle ressource
        const newResource = new LearningResource({
            type: 'video', // ou autre type de ressource
            fileUrl: fileUrl,
            name: name,
            description: description
        });

        // Enregistrez la nouvelle ressource dans la base de données
        await newResource.save();

        // Ajoutez la nouvelle ressource à la section spécifiée du cours
        course.sections[sectionIndex].resources.push(newResource._id);
        await course.save();

        res.status(201).json({ message: 'Resource added to course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getAllResources = async (req, res) => {
    try {
        const learningResource = await LearningResource.find();
        res.status(200).json(learningResource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResourceById = async (req, res) => {
    try{
        const learningResource = await LearningResource.findById(req.params.id);
        if(!learningResource){
            return res.status(404).json({ message: "ressource non trouvé!"});
        }
        res.status(200).json(learningResource);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const learningResource = await LearningResource.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(learningResource);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        await LearningResource.findByIdAndDelete(id);
        res.status(204).json({ message: "Ressource supprimée!"})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};