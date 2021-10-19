const { verify } = require('../helpers/jwt')
const { User, Donation } = require('../models')

const authe = async (req, res, next) => {
    try {
        const token = req.headers.access_token
        if (!token) {
            throw {
                name: 'Unauthenticated',
                message:'Invalid Token'
            }
        }
        const payload = verify(token)
        const userCheck = await User.findOne({
            where: {
                id: payload.id,
                email: payload.email
            }
        })
        if (!userCheck) {
            next({
                name: 'Unauthenticated',
                message:'Invalid Token'
            })
        } else {
            req.user = { id: userCheck.id, username: userCheck.username, role: userCheck.role, email: userCheck.email, phoneNumber:userCheck.phoneNumber }
            next()
        }
    } catch (err) {
        next(err)
    }
}

// const authZ = async (req, res, next) => {
//     try {
//         const donationId = +req.params.id
//         const role = req.user.role
//         if (role === 'admin') {
//             const donation = await Donation.findByPk(donationId)
//             if (!donation) {
//                 throw {
//                     name: 'Not Found',
//                     message: "Donation Not Found"
//                 }
//             }

//             next()
//         } else {
//             throw {
//                 name: 'Forbidden',
//                 message: "You dont have credentials"
//             }
//         }

//     } catch (err) {
//         next(err)
//     }
// }

module.exports = { authe
    // , authZ 
}