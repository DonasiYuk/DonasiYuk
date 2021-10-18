const app = require('../app');
const request = require('supertest');
const { User, Donation, Transaction } = require('../models');

let access_token;


beforeAll(() => {
    User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
    Transaction.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true })
})


describe('reporting feature', () => {
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
            .field('lat', 1231231)
            .field('long', 123123131)
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
            .then(res => {
                expect(res.statusCode).toBe(201)
                done()
            })
            .catch(err => console.log(err.response))
    })

            
    test('valid formData should return success', (done) => {
        request(app)
            .post('/report')
            .set('access_token', access_token)
            .field('description', 'Test Description')
            .field('donationId', 1)
            .attach("image", "./assets/Logo_Hacktiv8.jpg")
            .then(res => {
                expect(res.statusCode).toBe(201)
                done()
            })
            .catch(err =>{
                console.log(err)
                done()
            })
    })

})