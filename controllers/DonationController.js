const midtransClient = require('midtrans-client')
const sha512 = require('js-sha512')
const { Donation, User, Report, Transaction, sequelize } = require('../models')

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

    static async transaction(req, res, next) {
        try {
            const id = req.params.id
            const userId = req.user.id
            const { amount } = req.body
            const newTransaction = await Transaction.create({ amount, donatorId: userId, donationId: id, status: "pending" })
            if (newTransaction) {
                let snap = new midtransClient.Snap({
                    // Set to true if you want Production Environment (accept real transaction).
                    isProduction: false,
                    serverKey: process.env.MIDTRANSKEY
                });

                let parameter = {
                    "transaction_details": {
                        "order_id": newTransaction.id,
                        "gross_amount": +amount
                    },
                    "credit_card": {
                        "secure": true
                    },
                    "customer_details": {

                        "first_name": req.user.username,
                        "last_name": req.user.username,
                        "email": req.user.email,
                        "phone": req.user.phoneNumber

                    }
                };

                let trx = await snap.createTransaction(parameter)
                trx.orderId = newTransaction.id
                res.status(201).json(trx)
            }
        } catch (err) {
            console.log(err);
            next(err)
        }

    }

    static async patchTransaction(req, res, next) {
        const t = await sequelize.transaction()
        try {
            // console.log(req.body);
            const { order_id, status_code, gross_amount, signature_key, transaction_status, } = req.body
            

            let hash = await sha512(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANSKEY}`)

            if (hash === signature_key) {// untuk melakukan verifikasi signature key
                console.log('masuk');
                if (transaction_status == 'capture' || transaction_status == 'settlement') {// untuk handdle yang transaksi sukses
                    const updatedTransaction = await Transaction.update({ status: "success" }, {
                        where: { id: order_id },
                        returning: true,
                        transaction: t
                    })
                    
                    const id = updatedTransaction[1][0].dataValues.donationId
                    const currentDonation = await Donation.findOne({
                        where: { id }
                    })
                 
                    const oldBalance = currentDonation.dataValues.balance
                    const newAmount = +gross_amount
                    const updatedDonation = await Donation.update({ balance: oldBalance + newAmount }, {
                        where: { id },
                        transaction: t
                    })
                    console.log('masuk');
                    if (updatedTransaction && updatedDonation) {
                        await t.commit()
                        res.status(200).json(updatedDonation)
                    } else {
                        throw {
                            name: 'Not Found',
                            message: 'transaction & donation not found'
                        }
                    }

                } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') { // untuk handdle yang transaksi gagal/cancel
                    const updatedTransaction = await Transaction.update({ status: "cancel" }, {
                        where: { id: order_id }
                    })
                    if (updatedTransaction) {
                        res.status(200).json(updatedTransaction)
                    } else {
                        throw {
                            name: 'Not Found',
                            message: 'transaction & donation not found'
                        }
                    }
                }
            } else {
                throw {
                    name: "Transaction error",
                    message: "signature key not match"
                }
            }

        } catch (err) {
            await t.rollback()
            next(err)
        }
    }


}

module.exports = DonationController;