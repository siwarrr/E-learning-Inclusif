const express = require('express');
const router = express.Router();
const learningResourceController = require('../controllers/learningResourceController');
const authenticate = require('../middleware/authenticate');

router.post('/:courseId/resources', authenticate, learningResourceController.addResourceToCourse);
router.get('/', learningResourceController.getAllResources);
router.get('/:id', learningResourceController.getResourceById);
router.put('/:id', learningResourceController.updateResource);
router.delete('/:id', learningResourceController.deleteResource);

module.exports = router;