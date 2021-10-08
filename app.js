const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes/index');
const { connect } = require('./config/mongodb');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

connect()
    .then(() => {
        console.log('Connect Success');
        app.listen(port, () => {
          console.log(`Example app listening at http://localhost:${port}`)
        })
    })