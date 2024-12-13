$(document).ready(function () {
    // Inicialização do carousel
    $('#carousel-imagens').slick({
        autoplay: true,
        arrows: false,
        dots: true
    });

    // Máscaras
    $('#telefone').mask('(00) 00000-0000', {
        placeholder: '(DDD) 12345-6789'
    });

    $('#cpf').mask('000.000.000-00', {
        placeholder: '123.456.789-00'
    });

    $('#cep').mask('00000-000', {
        placeholder: '01234-567'
    });

    // Validação do formulário
    $('form').validate({
        rules: {
            nome: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            telefone: {
                required: true
            },
            endereco: {
                required: true
            },
            cep: {
                required: true
            },
            cpf: {
                required: true
            }
        },
        messages: {
            nome: "Por favor, insira seu nome completo.",
            email: "Insira um endereço de e-mail válido.",
            telefone: "O telefone é obrigatório.",
            endereco: "Insira seu endereço completo.",
            cep: "O CEP é obrigatório.",
            cpf: "O CPF é obrigatório."
        },
        submitHandler: function (form) {
            alert("Sua requisição foi enviada para análise, parabéns pela aquisição!");
            form.reset();
        },
        invalidHandler: function (form, validator) {
            alert("Por favor, preencha todos os campos obrigatórios para prosseguir com a compra!");
        }
    });
});
