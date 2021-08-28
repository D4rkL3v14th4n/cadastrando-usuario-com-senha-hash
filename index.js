if(process.env.NODE_ENVIRONMENT == 'DEV')
    require('dotenv/config');
const { Client } = require('pg');
const { gerarSenha, codificarEmSHA512 } = require('./gerarSenha');
// Configuração de conexão com a base. Neste exemplo está sendo utilizado o PostgresSQL
const sqlConfig = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PWD
}
// Inicia a instância do cliente
let client = new Client(sqlConfig);
// Conecta com a base
client.connect();
// Tenta logar o usuário
logar('teste123@gmail.com','1234');
// Cria Usuário
function createUser(_input){
    // Cria o hash da senha juntamente com o salt
    _input.senha = gerarSenha(_input.senha);
    console.log(_input);
    client.query(`
        INSERT INTO USUARIO(NOME,EMAIL,CPF,SENHA) 
        VALUES
        (
            '${_input.nome}' ,
            '${_input.email}',
            '${_input.cpf}'  ,
            '${_input.senha}'
        )
    `)
    .then( res => console.log(`Linhas Afetadas: ${res.rowCount}`))
    .catch( err => console.log(err))
}
// Autentificando o usuário
async function logar(email, senha){
    let result = await client.query(`
        SELECT  EMAIL, 
                SENHA 
        FROM USUARIO 
        WHERE EMAIL = '${email}'
    `)
    .then( res => res.rows[0] )
    .catch( err => console.log("Ocorreu um erro ao tentar recuperar o usuário"))
    if(email == result.email && verificaSenha(senha, result.senha))
        console.log("Logado com sucesso!")
    else
        console.log("Email ou senha incorretos")
}
// Comparando os as senhas
function verificaSenha(senha, senhaNoBanco){
    let saltNoBanco = senhaNoBanco.slice(0,32);
    let hashNoBanco = senhaNoBanco.slice(32);
    let senhaComSalt = codificarEmSHA512(senha, saltNoBanco);
    return hashNoBanco === senhaComSalt.hash;
}

