const { User } = require('../models');

class UserController {
    static async register(req, res, next) {
        try {
            let { username='', email='', password='', phoneNumber, address, role="user"} = req.body;

            const newUser = await User.create({ username, email, password, phoneNumber, address, role})
            res.status(201).json({
                id: newUser.id,
                email
            })
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;