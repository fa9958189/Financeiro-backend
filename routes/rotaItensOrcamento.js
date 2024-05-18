const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// Rota para cadastrar um orçamento
router.post("/", (req, res) => {
    const { id } = req.body;
     console.log(id)
    // Insira os dados do orçamento no banco de dados
    mysql.query(
        "INSERT INTO orcamento (id_cliente) VALUES (?)",
        [id],
        (error, results, fields) => {
            console.log(error.message)
            if (error) {
                console.error("Erro ao cadastrar orçamento:", error.message);
                return res.status(500).json({ mensagem: "Erro ao cadastrar orçamento. " + error.message });
            }
            res.status(201).json({ mensagem: "Orçamento cadastrado com sucesso!" });
        }
    );
});
 



// Rota para listar todos os orçamentos
router.get("/:id", (req, res) => {
    const {id} = req.params;
    mysql.query(`
    SELECT  
            itens_orcamento.id as id,
            itens_orcamento.id_produto as id_produto, 
            itens_orcamento.quantidade as quantidade,
            itens_orcamento.valor_unitario as valor_unitario,
            itens_orcamento.total as total,
            produto.descricao as descricao
        FROM itens_orcamento 
        INNER JOIN produto on
        itens_orcamento.id_produto=produto.id
        where itens_orcamento.id_orcamento=${id}
    `, (error, results, fields) => {
        if (error) {
            console.error('Erro ao executar query:', error.message); // Verifica se error não é null
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({
            mensagem: "Aqui estão todos os orçamentos cadastrados",
            orcamentos: results
        });
    });
});


module.exports = router;
