const router = require('express').Router();
const UserController = require('../controllers/UserController');
const errorHandler = require('../middlewares/errorHandler');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(errorHandler);

module.exports = router;