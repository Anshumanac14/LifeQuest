const express = require('express');
const router = express.Router();
const { getHabits, createHabit, updateHabit, deleteHabit, completeHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', completeHabit);

module.exports = router;
