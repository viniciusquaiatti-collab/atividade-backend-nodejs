const { clienteModel } = require("../models/clienteModel");
const bcrypt = require("bcrypt");

const clienteController = {
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                return res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos();
            res.status(200).json(clientes);
        } catch (error) {
            console.error("Erro ao listar clientes", error);
            res.status(500).json({ Message: "Erro ao buscar clientes" });
        }
    },

    criarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente, emailCliente, senhaCliente } = req.body;

            if (nomeCliente == undefined || nomeCliente.trim() == "" || cpfCliente == undefined || cpfCliente.length !== 11 || emailCliente == undefined || emailCliente.trim() == "" || !emailCliente.includes("@") || senhaCliente == undefined || senhaCliente.trim() == "" || senhaCliente.length < 8) {
                return res
                    .status(400)
                    .json({ erro: "Campos obrigatorios não preenchidos!" });
            }

            const result = await clienteModel.buscarEmailOrCPF(cpfCliente, emailCliente);

            if (result.length > 0) {
                return res.status(409).json({ message: "CPF ou Email já cadastrados!" });
            }

            const saltRounds = 10;

            const senhaCriptografada = bcrypt.hashSync(senhaCliente, saltRounds);

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, emailCliente, senhaCriptografada);

            res.status(201).json({ Message: "Cliente cadastrado com sucesso!" });
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" });
        }
    }
}

module.exports = { clienteController }