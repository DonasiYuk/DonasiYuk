const { User } = require('../models');
const {decode, encode} = require('../helpers/bcryptjs')
const {sign} = require('../helpers/jwt')

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

    static login(req, res, next){
        console.log(req.body)
        const {email, password} = req.body

        User.findOne({
            where: {email}
        })
        .then(data => {
            if(data){
                const valid = decode(password, data.password)
                if(valid){
                    const access_token = sign({
                        id:data.id,
                        email:data.email
                    })
                    res.status(200).json({ access_token, role:data.role})
                }else{
                    next({
                        name: 'Unauthenticated',
                        code: 401,
                        message: "Email / Password incorrect"
                    }) 
                }
            }else{
                next({
                    name: 'Unauthenticated',
                    code: 401,
                    message: "Email / Password incorrect"
                }) 
            }
        })
        .catch(err =>{
            console.log(err, '<<< error')
            next({
                name: 'Unauthenticated',
                code: 401,
                message: "Email / Password incorrect"
            }) 
        })
    }
}

module.exports = UserController;