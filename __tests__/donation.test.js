const app = require('../app');
const request = require('supertest');
const { User, Donation, Transaction } = require('../models');

let access_token;
const invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYW1iYW5Ad2MuY29tIiwiaWF0IjoxNjMzNzkxODIwfQ.wyIywE0Oyuj86FQ9f_wmxm1G32AI9cbP0J1MJ0IKFYo'

beforeAll(() => {
    User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
    // Transaction.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
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
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
            .then(res => {
                expect(res.statusCode).toBe(201)
                done()
            })
            .catch(err => console.log(err.response))
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
            .set('access_token', invalidtoken)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            lat: '1231231',
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            lat: '1231231',
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', '')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', '')
            .field('targetAmount', 100000)
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', '')
            .field('lat', '1231231')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty lat', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: '',
            long: '123123131'
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', '')
            .field('long', '123123131')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err))
    })

    test('create donation with empty long', (done) => {
        const data = {
            title: 'untuk gacha',
            description: 'untuk beli gacha pou',
            targetAmount: 100000,
            lat: '1231231',
            long: ''
        }

        request(app)
            .post('/donations')
            .set('access_token', access_token)
            .field('title', 'untuk gacha')
            .field('description', 'untuk beli gacha pou')
            .field('targetAmount', 100000)
            .field('lat', 1231231)
            .field('long', '')
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
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

    test('update transaction Success', (done) => {
        const data = {
            order_id: '1',
            status_code: 200,
            gross_amount: '20000.00',
            signature_key: "c11cc1343589fa3a063ba825661d90ac9a7f2be5edc3359cb2df7f638ddce5701d2cf825d728667d06df9e2de6eced6a76cee2d18c057420f9ce21de87a4cc4c",
            server_key: 'SB-Mid-server-gH99PffZO7jXs_5na5hjQIrF',
            transaction_status: "settlement",
        }

        request(app)
            .post('/patchTransaction')
            .send(data)
            .then(res => {
                expect(res.statusCode).toBe(200)
                done()
            })
            .catch(err => console.log(err, '<<<<<<<<<<<'))

    })

    test('update transaction Fail 400 not match signature key', (done) => {
        const data = {
            order_id: '3',
            status_code: 200,
            gross_amount: '20000.00',
            signature_key: "a99aeb86abbac3f0bdc5b98a82fb0f665b8d7d8f9cbc0be724b8297e6eca3e01438129c412e3665637621b654c628bc5cf22a1047cb8621d872f8d739fda5a75",
            server_key: 'SB-Mid-server-DJaY67FuAlYFm7aiT045x-up',
            transaction_status: "settlement",
        }

        request(app)
            .post('/patchTransaction')
            .send(data)
            .then(res => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toHaveProperty('message')
                done()
            })
            .catch(err => console.log(err, '<<<<<<<<<<<'))

    })

    test('200 GET/donation', done => {
        request(app)
            .get('/donations')
            .set('access_token', access_token)
            .then(res => {
                const { status, body } = res
                expect(status).toBe(200)
                expect(body).toEqual(expect.arrayContaining(body));
                done()
            })
    })

    test('200 Put/donation', done => {

        const payload = {
            title: 'Untuk yayasan',
            description: 'donasilah',
            targetAmount: 253652,
            lat: 12343,
            long: 121232
        }

        request(app)
            .put('/donations/1')
            .set('access_token', access_token)
            .send(payload)
            .then(res => {
                const { status, body } = res
                expect(status).toBe(200)
                expect(body).toHaveProperty('message')
                done()
            })
    })

    test('404 Put/donation', done => {

        const payload = {
            title: 'Untuk yayasan',
            description: 'donasilah',
            targetAmount: 253652,
            lat: 12343,
            long: 121232
        }

        request(app)
            .put('/donations/3')
            .set('access_token', access_token)
            .send(payload)
            .then(res => {
                const { status, body } = res
                expect(status).toBe(404)
                expect(body).toHaveProperty('message')
                done()
            })
    })

    test('success get donation by id', done => {

        request(app)
            .get('/donations/1')
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })

    test('404 get/donation by id', done => {

        request(app)
            .get('/donations/2')
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(404)
                expect(res.body).toHaveProperty('message')
                done()
            })
    })

    test('401 get/donation by id', done => {

        request(app)
            .get('/donations/1')
            .then(res => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('message')
                done()
            })
    })
    

})

describe('my donation feature', () => {
    test('should get user donation only', (done) => {
        request(app)
            .get('/myDonation')
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })

    test('should failed get user donation without access token', (done) => {
        request(app)
            .get('/myDonation')
            .then(res => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('message')
                done()
            })
    })

})

describe('withdraw feature', () => {
    test('should failed if withdraw without access token', (done) => {
        request(app)
            .put('/withdraw/1')
            .then(res => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('message')
                done()
            })
    })

    test('should failed if there is no donation ', (done) => {
        request(app)
            .put('/withdraw/9999')
            .set('access_token', access_token)
            .then(res => {
                expect(res.statusCode).toBe(404)
                expect(res.body).toHaveProperty('message')
                done()
            })
    })

    test('should return success', (done) => {
        request(app)
            .put('/withdraw/1')
            .set('access_token', access_token)
            .send({
                withdrawalAmount: 0
            })
            .then(res => {
                expect(res.statusCode).toBe(200)
                expect(res.body.status).toBe('closed')
                done()
            })
    })

})