const bcrypt = require('bcryptjs');

function encode(password){
    const salt = bcrypt.genSaltSync(10);
    return hash = bcrypt.hashSync(password, salt);
}

function decode(password, hash){
    return bcrypt.compareSync(password, hash); 
}

module.exports = {
    encode,
    decode
}
