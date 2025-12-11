const { json } = require("express");
const jwt = require("jsonwebtoken");

const verify = {
    cliente: async (req, res, next) => {
        try {
            const {token} = req.cookies;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded.tipoUsuario || decoded.tipoUsuario !== "cliente") {
                return res.status(403).json({ erro: "Acesso permitido somente para clientes" });
            }

            next();

        } catch (error) {
            return res.status(401).json({erro: "Token inválido ou expirado!" });
        }
    }
};

module.exports = { verify};