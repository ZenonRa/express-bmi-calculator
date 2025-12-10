const express = require('express');
const router = express.Router();
const controller = require('../controllers/bmiController');


// POST /api/bmi - calculate BMI from JSON form or query
router.post('/', controller.create);


// Also support GET /api/bmi/calc via query params for convenience
// Example: GET /api/bmi/calc?weightKg=70&heightCm=175
router.get('/calc', (req, res) => {
// reuse controller.create by calling it with req/res
    return controller.create(req, res);
});


// CRUD for saved records
router.get('/records', controller.listRecords);
router.get('/records/:id', controller.getRecord);
router.put('/records/:id', controller.updateRecord);
router.delete('/records/:id', controller.deleteRecord);


module.exports = router;