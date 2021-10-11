const { Donation, User, Report } = require('../models')

class DonationController {

    static async createDonation(req, res, next) {
        try {
            const id = req.user.id
            const { title, description, targetAmount, lat, long } = req.body
            const newDonation = await Donation.create({ title, description, targetAmount, userId: id, lat, long })
            if (newDonation) {
                res.status(201).json({ newDonation })
            }
        } catch (err) {
            next(err)
        }
    }

    static async getListDonation(req, res, next) {
        try {
            const data = await Donation.findAll()
            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }

    static async editDonation(req, res, next) {
        const donationId = req.params.id
        const {
            title,
            description,
            targetAmount,
            lat,
            long
        } = req.body
        try {
            const found = await Donation.findByPk(+donationId)
            if (found) {
                await Donation.update({
                    title, description, targetAmount, lat, long
                }, {
                    where: {
                        id: donationId
                    },
                    returning: true,
                    plain: true
                }
                )
                res.status(200).json(
                    {message : 'Update Donation success'}
                )
            } else {
                throw {
                    name : 'Not Found',
                    message : 'Data is not found'
                }
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = DonationController;