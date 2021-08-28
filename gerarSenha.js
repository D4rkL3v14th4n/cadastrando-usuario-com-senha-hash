const crypto = require('crypto');

function codificarEmSHA512(senha, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(senha);
    hash = hash.digest('hex');
    return {
        salt,
        hash
    }
}

function gerarSenha(senha){
    let salt = crypto.randomBytes(16).toString('hex');
    let senhaComSalt = codificarEmSHA512(senha, salt);
    return (senhaComSalt.salt + senhaComSalt.hash);
}

module.exports = {
    gerarSenha,
    codificarEmSHA512
};

