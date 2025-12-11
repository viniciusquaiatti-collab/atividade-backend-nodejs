const { sql, getConnection } = require("../config/db");

const clienteModel = {
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const sqlQuery = "SELECT * FROM Clientes;";

            const result = await pool.request()
                .query(sqlQuery);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
            throw error;
        }
    },

    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = `SELECT * FROM clientes WHERE idCliente = @idCliente`;

            const result = await pool
                .request()
                .input(`idCliente`, sql.UniqueIdentifier, idCliente)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error(`Erro ao buscar o cliente:`, error);
            throw error;
        }
    },

    buscarEmailOrCPF: async (cpfCliente, emailCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente OR emailCliente = @emailCliente";

            const result = await pool
                .request()
                .input("cpfCliente", sql.Char(11), cpfCliente)
                .input("emailCliente", sql.VarChar(200), emailCliente)
                .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
            throw error;
        }
    },

    buscarPorEmail: async (emailCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = "SELECT * FROM Clientes WHERE emailCliente = @emailCliente;";

            const result = await pool
                .request()
                .input("emailCliente", sql.VarChar(200), emailCliente)
                .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
            throw error;
        }
    },

    inserirCliente: async (nomeCliente, cpfCliente, emailCliente, senhaCliente) => {
        try {
            const pool = await getConnection();

            let querySQL =
                "INSERT INTO clientes  (nomeCliente, cpfCliente, emailCliente, senhaCliente) VALUES ( @nomeCliente, @cpfCliente, @emailCliente, @senhaCliente)";

            await pool.request()
                .input(`nomeCliente`, sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.Char(11), cpfCliente)
                .input("emailCliente", sql.VarChar(200), emailCliente)
                .input("senhaCliente", sql.VarChar(255), senhaCliente)
                .query(querySQL);
        } catch (error) {
            console.error("Erro ao criar cliente!", error);
            throw error;
        }
    }
}

module.exports = { clienteModel };