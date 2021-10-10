const app = require('../app');
const request = require('supertest');
const { User } = require('../models');


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

    const invalidParams = {
        email: 'haha@hihi.com',
        password: 'hihi'
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
            expect(res.statusCode).toBe(200)
            expect(res.body.role).toBe('admin')
            expect(res.body).toHaveProperty('access_token', expect.any(String))
            done()
        })
    })

    test('invalid parameters should return error status', (done) => {
        request(app)
        .post('/users/login')
        .send(invalidParams)
        .then(res => {
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe('Email / Password incorrect')
            done()
        })
    })
})