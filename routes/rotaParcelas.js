
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool; // Importa o pool de conexões MySQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require("../app");




router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    mysql.getConnection((error,conn)=>{
        conn.query("SELECT * FROM parcelas where numeroorcamento=? ",[id], (error, results, fields) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }
    
            if (results.length === 0) {
                return res.status(404).send({
                    mensagem: "parcelas não encontrado."
                });
            }
    
            res.status(200).send({
                mensagem: "Aqui está as parcelas solicitadas",
                parcelas: results
            });
        });
    });
});
router.get("/", (req, res, next) => {
 
    mysql.getConnection((error,conn)=>{
    conn.query("SELECT * FROM parcelas ", (error, results, fields) => {
        conn.release();
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).send({
                mensagem: "parcelas não encontrado."
            });
        }

        res.status(200).send({
            mensagem: "Aqui está o usuário solicitado",
            parcelas: results
        });
    });
});
});


router.post('/', (req, res, next) => {
  
    const {
        valorentrada,
        numeroorcamento,
        valortotal,
        quantidadeparcela,
         } = req.body;
const resto =parseFloat(valortotal-valorentrada);
const valorparcela = parseFloat(resto/quantidadeparcela)

    // Verifica se o CPF já está cadastrado
    mysql.getConnection((error,conn)=>{
    conn.query('CALL gerar_parcelas(?,?,?)', [numeroorcamento,valorparcela,quantidadeparcela], (error, results, fields) => {
        conn.release();
        if (error) {
            return res.status(500).send({
                error: error.message,
                response: null
            });
        }

      
            return res.status(201).send({
                mensagem: "Parcelas geradas com sucesso"
            });
        

    });
});
});


router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: "Parâmetros inválidos" });
    }

    // Verifica se o usuário existe antes de excluí-lo
    mysql.getConnection((error,conn)=>{
    conn.query('SELECT * FROM usuario WHERE id = ?', [id], (error, results, fields) => {
        conn.release();
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).send({
                mensagem: "Usuário não encontrado."
            });
        }

        // Exclui o usuário do banco de dados
        mysql.getConnection((error,conn)=>{
        conn.query("DELETE FROM usuario WHERE id=?", [id], (deleteError, results, fields) => {
            if (deleteError) {
                return res.status(500).send({
                    error: deleteError.message
                });
            }
            res.status(200).send({ mensagem: "Usuário excluído com sucesso!" });
        });
    });
});
});
});





module.exports = router;
