const DonationController = require('../controllers/DonationController');
const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler')
const { authe, authZ } = require('../middlewares/authentication')
const upload = require('../middlewares/multer')
const imgKit = require('../middlewares/imgKit')

router.get('/donations', DonationController.getListDonation)
router.post('/donations', authe, upload.single("image"), imgKit, DonationController.createDonation)
router.put('/donations/:id', authe, DonationController.editDonation)

router.post('/transactions/:id', authe, DonationController.transaction)

router.patch('/patchTransaction', DonationController.patchTransaction)

router.get('/myDonation', authe, DonationController.userDonation)
router.put('/withdraw/:id', authe, DonationController.withdraw)
router.post('/report', authe, upload.single("image"), imgKit, DonationController.reporting)
// router.post('/report', (req, res) => {
//     console.log(req., '<<< ini req')
// })

router.use(errorHandler)
module.exports = router;