const sql = require("mssql");

const config = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER_DB,
    database: process.env.NAME_DB,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

/**
 * Cria e retorna uma conexão com o banco de dados SQL Server
 * 
 * @async
 * @function getConnection
 * @returns {Promise<object>} Retorna o objeto de conexão (pool) com o banco de dados.
 * @throws Mostra no console se ocorrer erro na conexão.
 */
async function getConnection() {
    try {
        const pool = await sql.connect(config);

        return pool;

    } catch (error) {
        console.error('Erro na conexão SQL Server:', error);
    }
};

(async () => {
    const pool = await getConnection();

    if (pool) {
        console.log("Conexão com o DB estabelecida com sucesso!");
    }
})();

module.exports = { sql, getConnection };