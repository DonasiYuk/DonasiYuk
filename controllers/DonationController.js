const { Donation, User, Report } = require('../models')

class DonationController {

    static async createDonation(req, res, next) {
        try {
            const id = req.user.id
            const { title, description, targetAmount, lat, long } = req.body
            const newDonation = await Donation.create({ title, description, targetAmount, userId: id, lat, long })
            if (newDonation) {
                res.status(201).json({newDonation})
            } 
        } catch (err) {
            next(err)
        }
    }
}

module.exports = DonationController;