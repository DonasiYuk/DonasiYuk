const { User } = require('../models');
const {decode, encode} = require('../helpers/bcryptjs');
const {sign} = require('../helpers/jwt');
// const fetchGoogleUser = require('../middlewares/googleAuth');

class UserController {
    static async register(req, res, next) {
        try {
            let { username='', email='', password='', phoneNumber, address, role="user"} = req.body;

            const newUser = await User.create({ username, email, password, phoneNumber, address, role});
            res.status(201).json({
                id: newUser.id,
                email
            })
        } catch (err) {
            next(err);
        }
    }

    static login(req, res, next){
        const {email, password} = req.body;

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

    static async userProfile(req, res, next) {
        try {
            const { id } = req.user;

            const currentUser = await User.findByPk(id)

            if(!currentUser) {
                throw {
                    name: 'Not Found',
                    message: 'User Not Found'
                }
            }

            res.status(200).json({
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email,
                phoneNumber: currentUser.phoneNumber,
                address: currentUser.address
            })
        } catch (err) {
            next(err)
        }
    }

    static async editUser(req, res, next) {
        try {
            let { username, email, phoneNumber, address, role} = req.body;

            const updatedUser = await User.update({ username, email, phoneNumber, address, role}, {
                where: { id: req.user.id },
                returning: true
            });

            res.status(200).json(updatedUser[1][0])
        } catch (err) {
            next(err)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const idToken = req.body.idToken;
            let payload = await fetchGoogleUser(idToken);
            let { email, name } = payload;

            let user = await User.findOrCreate({
                where: {
                    email
                },
                defaults: {
                    username: name,
                    email,
                    role: "user",
                    password: "12345",
                    phoneNumber: "",
                    address: ""
                }
            })
            let access_token = sign({ id: user[0].id, email: user[0].email });
            req.headers.access_token = access_token;
            res.status(200).json({ 
                access_token,
                username: user[0].username,
                role: user[0].role,
                userId: user[0].id
            });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = UserController;