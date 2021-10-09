const router = require('express').Router();
const UserController = require('../controllers/UserController');
const errorHandler = require('../middlewares/errorHandler');

router.post('/register', UserController.register);

router.use(errorHandler);

module.exports = router;