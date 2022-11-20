let inputBoxEmail = document.querySelector("#email");
let inputBoxNovaSenha = document.querySelector("#newpassword");
let inputBoxConfNovaSenha = document.querySelector("#confnewpassword");
let result = document.querySelector('.result');

let mensagemErroEmail = document.querySelector("#mensagemErroEmail");
let mensagemErroNovaSenha = document.querySelector("#mensagemErroNovaSenha");
let mensagemErroConfirmacaoNovaSenha = document.querySelector("#mensagemErroConfirmacaoNovaSenha");

let botaoRecuperar = document.querySelector("#botaoRecuperar");

const BASE_URL = 'http://localhost:3000/password-recovery/';
const EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

botaoRecuperar.addEventListener('click', (e) => {

    let emailDigitado = inputBoxEmail.value + "";
    let novaSenhaDigitada = inputBoxNovaSenha.value + "";
    let confNovaSenhaDigitada = inputBoxConfNovaSenha.value + "";

    if (!emailDigitado.match(EMAIL_PATTERN) || novaSenhaDigitada.length < 8 || novaSenhaDigitada != confNovaSenhaDigitada)
    {
        if (!emailDigitado.match(EMAIL_PATTERN))
        {
                mensagemErroEmail.style.display = "block";
                mensagemErroEmail.innerHTML = "Padrão de email incorreto";
                e.preventDefault();
        }
        else { mensagemErroEmail.style.display = "none"; }


        if (novaSenhaDigitada.length < 8)
        {
            e.preventDefault();
            mensagemErroNovaSenha.style.display = "block";
            mensagemErroNovaSenha.innerHTML = "Senha inválida";
        }
        else
        {mensagemErroNovaSenha.style.display = "none"; }

        
        if (novaSenhaDigitada != confNovaSenhaDigitada)
        {
            e.preventDefault();
            mensagemErroConfirmacaoNovaSenha.style.display = "block";
            mensagemErroConfirmacaoNovaSenha.innerHTML = "Confirmação de Senha diferente de Senha";
        }
        else
        {mensagemErroConfirmacaoNovaSenha.style.display = "none"; }
    }
    else { recuperarSenha(e); }



    function recuperarSenha(e)
    {
        e.preventDefault();

        let info = [];
        info.push(emailDigitado);
        info.push(novaSenhaDigitada);

        putInfo(info);
        async function putInfo(info)
        {
            if (info == "") return;
            const res = await fetch(BASE_URL,
            {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    parcel: info
                })
            });

            console.log(res.statusText + '-----------------1');
            console.log(res.json() + '-----------------2');
            console.log(res.status + '-----------------3');

            if (res.status.suce)
            {
                alert('deu merda');
                result.style.display = 'block';
                result.innerHTML = 'Fail to recover password, please try again later!';
            }
            else if (res.status.text == 'Password recovery worked out well')
            {
                alert('deu bom');
                result.style.display = 'block';
                result.innerHTML = 'Password recovery worked out well, now login with the new password!';
            }
        }
    }
});