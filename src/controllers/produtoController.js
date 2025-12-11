const { produtoModel } = require("../models/produtoModel");

const produtoController = {
    /**
     * Controlador que lista todos os produtos do banco de dados.
     * 
     * @async
     * @function listarProdutos
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma resposta JSON com a lista de produtos.
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar os produtos.
     */
    listarProdutos: async (req, res) => {
        try {
            const { idProduto } = req.query;

            if (idProduto) {
                if (idProduto.length != 36) { // Validando o UUID
                    return res.status(400).json({ erro: "Id do produto inválido!" });
                }

                const produto = await produtoModel.buscarUm(idProduto);

                return res.status(200).json(produto);
            }

            const produtos = await produtoModel.buscarTodos();

            res.status(200).json(produtos);

        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({ erro: 'Erro interno no servidor ao buscar produtos.' });
        }
    },

    /**
     * Controlador que cria um novo produto no banco de dados.
     * 
     * @async
     * @function criarProduto
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP) 
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON
     * @throws {400} Se algum campo obrigatório não for preenchido corretamente.
     * @throws {500}Se ocorrer qualquer erro interno no servidor.
     * 
     * @example
     * POST /produtos
     * BODY:
     * {
     *  "nomeProduto": "Camiseta",
     *  "precoProduto": 49.90
     * }
     */
    criarProduto: async (req, res) => {
        try {

            const { nomeProduto, precoProduto } = req.body;

            if (nomeProduto == undefined || nomeProduto.trim() == "" || precoProduto == undefined || isNaN(precoProduto)) {
                return res.status(400).json({ erro: "Campos Obrigatórios Não preenchidos" });
            }

            await produtoModel.inserirProduto(nomeProduto, precoProduto);

            res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });

        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
        }
    },

    /**
     * Controlador que atualiza (total ou parcialmente) um produto no banco de dados.
     * 
     * @async
     * @function atualizarProduto
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP).
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP).
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON.
     * @throws {400} Se o idProduto não for válido.
     * @throws {404} Se o produto não existir.
     * @throws {500} Se ocorrer qualquer erro interno no servidor.
     * 
     * @description
     * Permite atualizar todos os campos de um produto ou apenas alguns (atualização parcial).
     * Se um campo não for enviado no corpo da requisição, o valor atual é mantido no banco.
     * 
     * @example
     * PUT /produtos/{idProduto}
     * BODY:
     * {
     *   "nomeProduto": "Camiseta",
     *   "precoProduto": 49.90
     * }
     * 
     * Campos opcionais:
     * @param {string} [req.body.nomeProduto] - Novo nome do produto (opcional).
     * @param {number} [req.body.precoProduto] - Novo preço do produto (opcional).
    */
    atualizarProduto: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const { nomeProduto, precoProduto } = req.body;

            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto inválido!' });
            }

            const produto = await produtoModel.buscarUm(idProduto);

            if (!produto || produto.length !== 1) {
                return res.status(404).json({ erro: 'Produto não encontrado!' });
            }

            const produtoAtual = produto[0];

            const nomeAtualizado = nomeProduto ?? produtoAtual.nomeProduto;
            const precoAtualizado = precoProduto ?? produtoAtual.precoProduto;

            await produtoModel.atualizarProduto(idProduto, nomeAtualizado, precoAtualizado);

            res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ erro: 'Erro ao atualizar produto.' });
        }
    },

    /**
     * Controlador que exclui um produto no banco de dados.
     * 
     * @async
     * @function deletarProduto
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP).
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP).
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON.
     * @throws {400} Se o idProduto não for válido.
     * @throws {404} Se o produto não existir.
     * @throws {500} Se ocorrer qualquer erro interno no servidor.
    */
    deletarProduto: async (req, res) => {
        try {
            const { idProduto } = req.params;

            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto inválido!' });
            }

            const produto = await produtoModel.buscarUm(idProduto);

            if (!produto || produto.length !== 1) {
                return res.status(404).json({ erro: 'Produto não encontrado!' });
            }

            await produtoModel.deletarProduto(idProduto);

            res.status(200).json({ mensagem: 'Produto deletado com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            res.status(500).json({ erro: 'Erro ao deletar produto.' });
        }
    }
}

module.exports = { produtoController };