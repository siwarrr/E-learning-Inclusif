const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * @route POST /
 * @description Recherche des cours, des espaces de cours et des utilisateurs en fonction des données fournies.
 * @access Public
 */
router.post('/', searchController.searchCourses);

module.exports = router;
