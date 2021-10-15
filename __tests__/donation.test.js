const app = require('../app');
const request = require('supertest');
const { User, Donation, Transaction } = require('../models');

let access_token;
const invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYW1iYW5Ad2MuY29tIiwiaWF0IjoxNjMzNzkxODIwfQ.wyIywE0Oyuj86FQ9f_wmxm1G32AI9cbP0J1MJ0IKFYo'

beforeAll(() => {
    User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
    Transaction.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
})

describe('donation feature', () => {
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

    test('success create donation', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(201)
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with wrong access_token', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', invalidtoken)
            .then(res => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation without title', (done) => {
        const data = {
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation without description', (done) => {
        const data = {
            title: 'untuk gacha',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation without targetAmount', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation without lat', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation without long', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty title', (done) => {
        const data = {
            title: '',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty description', (done) => {
        const data = {
            title: 'untuk gacha',
            description: '',
            targetAmount: 100000,
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty targetAmount', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: '',
            lat: 1231231,
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty description', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: '',
            long: 123123131
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty description', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: 1231231,
            long: ''
        }

        request(app)
            .post('/donations')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('success make transaction', (done) => {
        const data = {
            amount: 20000
        }

        request(app)
            .post('/transactions/1')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(201)
                done()
            })
            .catch(err => console.log(err))
    })

    test('create transaction with wrong access_token', (done) => {
        const data = {
            amount: 20000
        }

        request(app)
            .post('/transactions/1')
            .send(data)
            .set('access_token', invalidtoken)
            .then(res => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create transaction with empty amount', (done) => {
        const data = {
            amount: ''
        }

        request(app)
            .post('/transactions/1')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create transaction without amount', (done) => {
        const data = {

        }

        request(app)
            .post('/transactions/1')
            .send(data)
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('update transaction succsess', (done) => {
        const data = {
            amount:10000,
            order_id: 'Postman-1578568851',
            status_code: 200,
            gross_amount: '10000.00',
            signature_key: "e78e2223638cb60dbdbc88d23deb9b927ac41be7263ab38758605bac834dc25425705543707504bfef0802914cfa3f5f538fa308d1f9086211c420e7892ba2ba",
            server_key: 'VT-server-HJMpl9HLr_ntOKt5mRONdmKj',
            transaction_status: "settlement",
        }

        request(app)
            .patch('/patchTransaction')
            .send(data)
            .then(res => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))

    })

    test('200 GET/donation', done => {
        request(app)
            .get('/donations')
            .then(res => {
                const { status, body } = res
                expect(status).toBe(200)
                expect(body).toEqual(expect.arrayContaining(body));
                done()
            })
    })

    test('200 Put/donation', done => {

        const payload = {
            title : 'Untuk yayasan', 
            description : 'donasilah', 
            targetAmount : 253652, 
            lat : 12343, 
            long : 121232
        }

        request(app)
            .put('/donations/1')
            .set('access_token', access_token)
            .send(payload)
            .then(res => {
                const { status, body }= res
                expect(status).toBe(200)
                expect(body).toHaveProperty('message')
                done()
            })
    })

    test('404 Put/donation', done => {

        const payload = {
            title : 'Untuk yayasan', 
            description : 'donasilah', 
            targetAmount : 253652, 
            lat : 12343, 
            long : 121232
        }

        request(app)
            .put('/donations/3')
            .set('access_token', access_token)
            .send(payload)
            .then(res => {
                const { status, body }= res
                expect(status).toBe(404)
                expect(body).toHaveProperty('message')
                done()
            })
    })

})
