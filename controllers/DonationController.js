const midtransClient = require('midtrans-client')
const sha512 = require('js-sha512')
const { Donation, User, Report, Transaction, sequelize } = require('../models')
const { sendMail } = require('../helpers/nodemailer') // usage: sendMail(email, subject, message)

class DonationController {

    static async createDonation(req, res, next) {
        try {
            const id = req.user.id
            const { title, description, targetAmount, lat, long, image } = req.body
            const newDonation = await Donation.create({ title, image, description, targetAmount, userId: id, lat, long })
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

    static async userDonation(req, res, next) {
        try {
            const { id } = req.user;
            const userDonations = await Donation.findAll({
                where: {
                    userId: id
                }
            })

            res.status(200).json(userDonations)
        } catch (err) {
            next(err)
        }
    }

    static async withdraw(req, res, next) {
        try {
            const { id } = req.params;
            const { withdrawalAmount } = req.body;
            const { email } = req.user;

            const donation = await Donation.findByPk(id)

            if (!donation) {
                throw {
                    name: 'Not Found',
                    message: "Donation Not found"
                }
            }

            const updatedBalance = donation.balance - withdrawalAmount

            const updatedDonation = await Donation.update({ balance: updatedBalance, status: 'complete'}, {
                where: { id },
                returning: true
            })

            if (!updatedDonation) {
                throw {
                    name: 'Transaction error',
                    message: 'Your Withdrawal Process failed'
                }
            }

            await sendMail(email, 'Withdrawal Successful', `You've successfully withdrawn Rp.${withdrawalAmount},00 to your Bank account `)

            res.status(200).json(updatedDonation[1][0])
        } catch (err) {
            console.log(err);
            next(err)
        }
    }
        
    static async reporting(req, res, next) {
        try {
            const { donationId, image, description } = req.body
            const newReport = await Report.create({ donationId, image, description })
            const donators = await Transaction.findAll({
                where:{
                    donationId
                },
                include: [User]
            })

            if (newReport && donators) {
                donators.forEach(donator => {
                   sendMail(donator.User.email, 'Donation Report', `The Foundation have upload a report for your donation, Please kindly check the donation page`)
                })
                res.status(201).json({ newReport })
            }
        } catch (err) {
            next(err)
        }
    }

}

module.exports = DonationController;