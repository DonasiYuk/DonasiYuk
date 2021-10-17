const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authe } = require('../middlewares/authentication');
const errorHandler = require('../middlewares/errorHandler');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', authe, UserController.userProfile);
router.put('/', authe, UserController.editUser);
router.post('/authGoogle', UserController.googleLogin);
router.get('/transactions', authe, UserController.historyTransaction);

router.use(errorHandler);

module.exports = router;