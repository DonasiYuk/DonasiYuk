const DonationController = require('../controllers/DonationController');
const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler')
const { authe } = require('../middlewares/authentication')

router.get('/donations', DonationController.getListDonation)
router.post('/donations', authe, DonationController.createDonation)
router.put('/donations/:id', authe,DonationController.editDonation)

router.post('/transactions/:id', authe, DonationController.transaction)

router.patch('/patchTransaction', DonationController.patchTransaction)

router.use(errorHandler)
module.exports = router;