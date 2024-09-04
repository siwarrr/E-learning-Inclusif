const express = require('express');
const router = express.Router();
const courseSpaceController = require('../controllers/courseSpaceController');

router.get('/', courseSpaceController.getAllCourseSpaces);
router.get('/:spaceId/courses', courseSpaceController.getAllCoursesInSpace);
router.post('/', courseSpaceController.createCourseSpace);
router.get('/:id', courseSpaceController.getCourseSpaceById);
router.put('/:id', courseSpaceController.updateCourseSpace);
router.delete('/:id', courseSpaceController.deleteCourseSpace);

module.exports = router;