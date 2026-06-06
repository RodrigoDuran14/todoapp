const express = require('express');
const router = express.Router();
const { getGroups, createGroup, updateGroup, deleteGroup } = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.route('/').get(getGroups).post(createGroup);
router.route('/:id').put(updateGroup).delete(deleteGroup);

module.exports = router;