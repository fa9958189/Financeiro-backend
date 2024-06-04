const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// Rota para cadastrar um orçamento
router.post("/", (req, res) => {
    const { id_orcamento, quantidade, valor_unitario, id_produto } = req.body;
    console.log(req.body);

    // Insira os dados do orçamento no banco de dados
    const query = `
        INSERT INTO itens_orcamento (id_orcamento, id_produto, quantidade, valor_unitario)
        VALUES (?, ?, ?, ?)
    `;
    mysql.getConnection((error,conn)=>{
    conn.query(query, [id_orcamento, id_produto, quantidade, valor_unitario], (error, results) => {
        conn.release();
        if (error) {
            console.error("Erro ao cadastrar orçamento:", error.message);
            return res.status(500).json({ mensagem: "Erro ao cadastrar orçamento. " + error.message });
        }
        res.status(201).json({ mensagem: "Orçamento cadastrado com sucesso!" });
    });
});
});

// Rota para listar todos os orçamentos
router.get("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id)
    const query = `
        SELECT  
            itens_orcamento.id as id,
            itens_orcamento.id_produto as id_produto, 
            itens_orcamento.quantidade as quantidade,
            itens_orcamento.valor_unitario as valor_unitario,
            (itens_orcamento.quantidade * itens_orcamento.valor_unitario) as total,
            produto.descricao as descricao
        FROM itens_orcamento 
        INNER JOIN produto ON itens_orcamento.id_produto = produto.id
        WHERE itens_orcamento.id_orcamento = ?
    `;
    mysql.getConnection((error,conn)=>{
    conn.query(query, [id], (error, results) => {
        conn.release();
        if (error) {
            console.error('Erro ao executar query:', error.message);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({
            mensagem: "Aqui estão todos os orçamentos cadastrados",
            orcamentos: results
        });
    });
});
});


router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: "Parâmetros inválidos" });
    }

    // Verifica se o item de orçamento existe antes de excluí-lo
    mysql.getConnection((error,conn)=>{
    conn.query('SELECT * FROM itens_orcamento WHERE id = ?', [id], (error, results, fields) => {
        conn.release();
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).send({
                mensagem: "Item de orçamento não encontrado."
            });
        }

        // Exclui o item de orçamento do banco de dados
        mysql.getConnection((error,conn)=>{
        conn.query("DELETE FROM itens_orcamento WHERE id=?", [id], (deleteError, results, fields) => {
            conn.release();
            if (deleteError) {
                return res.status(500).send({
                    error: deleteError.message
                });
            }
            res.status(200).send({ mensagem: "Item de orçamento excluído com sucesso!" });
        });
    });
});
});
});


module.exports = router;
