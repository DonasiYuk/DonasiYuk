const DonationController = require('../controllers/DonationController');
const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler')
const { authe } = require('../middlewares/authentication')

router.post('/donations', authe, DonationController.createDonation)

router.use(errorHandler)
module.exports = router;