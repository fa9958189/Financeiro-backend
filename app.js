const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('./uploads'));
app.use('/assets', express.static('./assets'));

// Configuração de headers para CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send({});
    }
    next();
});

// Rotas
const rotaUsuario = require("./routes/rotasUsuario");
const rotaProduto = require("./routes/rotasProduto");
const rotaEntrada = require("./routes/rotasEntrada");
const rotaSaida = require("./routes/rotasSaida");
const rotaEstoque = require("./routes/rotasEstoque");
const rotaOrcamento = require("./routes/rotasOrcamento"); // Adicionando a rota de Orçamento
const rotaCliente = require("./routes/rotasCliente"); // Adicionando a rota de Orçamento

// Uso das rotas
app.use("/usuario", rotaUsuario);
app.use("/produto", rotaProduto);
app.use("/entrada", rotaEntrada);
app.use("/saida", rotaSaida);
app.use("/estoque", rotaEstoque);
app.use("/orcamento", rotaOrcamento); 
app.use("/cliente", rotaCliente); 

// Tratamento de erros para rotas não encontradas
app.use((req, res, next) => {
    const erro = new Error("Não encontrado!");
    erro.status = 404;
    next(erro);
});

app.get("/", (req, res) => {
    return res.json("Hello World");
});

// Tratamento de erros globais
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;
