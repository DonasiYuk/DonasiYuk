const app = require('../app');
const request = require('supertest');
const { User } = require('../models');

let access_token;

beforeAll(() => {
    User.destroy({ where: {}, truncate:true, cascade:true, restartIdentity: true})
})

describe('register feature', () => {
    test('register without username', (done) => {
        const registerUserTest = {
            email: 'test@mail.com',
            password: '12345'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register without email', (done) => {
        const registerUserTest = {
            password: '12345',
            username: 'test'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register without password', (done) => {
        const registerUserTest = {
            email: 'test@mail.com',
            username: 'test'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register with username is empty string', (done) => {
        const registerUserTest = {
            email: 'test@mail.com',
            password: '12345',
            username: ''
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register with email is empty string', (done) => {
        const registerUserTest = {
            email: '',
            password: '12345',
            username: 'testing'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register with password is empty string', (done) => {
        const registerUserTest = {
            email: 'test@mail.com',
            password: '',
            username: 'testing'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register with wrong format email', (done) => {
        const registerUserTest = {
            email: 'testmailcom',
            password: '12345',
            username: 'testing'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('register with password length less than 5', (done) => {
        const registerUserTest = {
            email: 'testmailcom',
            password: '123',
            username: 'testing'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('should success register new user', (done) => {

        const registerUserTest = {
            email: 'test@mail.com',
            password: '12345',
            username: 'test'
        }

        request(app)
            .post('/users/register')
            .send(registerUserTest)
            .then(res => {
                expect(res.statusCode).toBe(201)
                expect(res.body.email).toBe(registerUserTest.email)
                expect(res.body.id).toEqual(expect.any(Number))
                done()
            })
            .catch(err => console.log(err))
    })
})

describe('user login test', () => {
    const userData = {
        email: 'admin@mail.com',
        password: 'admin',
        username: 'admin',
        phoneNumber: 14045,
        role: 'admin',
        address: 'jalan yang lurus'
    }

    const validParams = {
        email: 'admin@mail.com',
        password: 'admin'
    }

    const passwordSalah = {
        email: 'admin@mail.com',
        password: 'amdin'
    }

    const emailSalah = {
        email: 'amdin@mail.com',
        password: 'admin'
    }

    const emailKosong = {
        password: 'admin'
    }
    
    beforeAll(done => {
        User.create(userData)
        .then(() => {
            done()
        })
        .catch(err => {
            done(err)
        })
    })

    test('valid parameters should return access_token and role', (done) => {
        request(app)
        .post('/users/login')
        .send(validParams)
        .then(res => {
            access_token = res.body.access_token
            expect(res.statusCode).toBe(200)
            expect(res.body.role).toBe('admin')
            expect(res.body).toHaveProperty('access_token', expect.any(String))
            done()
        })
    })

    test('Wrong Password should return error status', (done) => {
        request(app)
        .post('/users/login')
        .send(passwordSalah)
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Email / Password incorrect')
            done()
        })
    })

    test('Wrong email should return error status', (done) => {
        request(app)
        .post('/users/login')
        .send(emailSalah)
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Email / Password incorrect')
            done()
        })
    })

    test('Empty email should return error status', (done) => {
        request(app)
        .post('/users/login')
        .send(emailKosong)
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Email / Password incorrect')
            done()
        })
    })
})

describe('User profile test', () => {
    test('access user profile without access token should return error', (done) => {
        request(app)
        .get('/users/profile')
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Invalid Token')
            done()
        })
    })
    console.log(access_token, '?????????????');
    test('access user profile with access token', (done) => {
        request(app)
        .get('/users/profile')
        .set({ access_token })
        .then(res => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('username')
            expect(res.body).toHaveProperty('email')
            done()
        })
    })
})

describe('user transactions history feature', () => {
    test('should success get history transactions', (done) => {
        request(app)
        .get('/users/transactions')
        .set({ access_token })
        .then(res => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('Transactions')
            done()
        })
        .catch(console.log())
    })

    test('should failed get history transactions without access token', (done) => {
        request(app)
        .get('/users/transactions')
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Invalid Token')
            done()
        })
    })
    
})

describe('edit user test', () => {
    const newUserData = {
        email: 'admin2@mail.com',
        username: 'admin2',
        phoneNumber: 14045,
        role: 'admin',
        address: 'jalan yang lurus kekanan'
    }

    test('edit user without send access token', (done) => {
        request(app)
        .put('/users')
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Invalid Token')
            done()
        })
    })

    test('valid parameters should success edit user', (done) => {
        request(app)
        .put('/users')
        .send(newUserData)
        .set({ access_token })
        .then(res => {
            expect(res.statusCode).toBe(200)
            expect(res.body.username).toBe(newUserData.username)
            expect(res.body.email).toBe(newUserData.email)
            done()
        })
    })
})
