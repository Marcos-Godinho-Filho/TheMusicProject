let inputBoxEmail = document.querySelector("#email");
let inputBoxSenha = document.querySelector("#password");

let mensagemErroEmail = document.querySelector("#mensagemErroEmail");
let mensagemErroSenha = document.querySelector("#mensagemErroSenha");

let botaoLogar = document.querySelector("#botaoLogin");

const BASE_URL = 'http://localhost:3000/authentication/';
const EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

botaoLogar.addEventListener('click', (e) => {

    let emailDigitado = inputBoxEmail.value + "";
    let senhaDigitada = inputBoxSenha.value + "";

    if (!emailDigitado.match(EMAIL_PATTERN) || senhaDigitada.length < 8) {
        if (!emailDigitado.match(EMAIL_PATTERN)) {
            mensagemErroEmail.style.display = "block";
            mensagemErroEmail.innerHTML = "Padrão de email incorreto";
            e.preventDefault();
        }
        else { mensagemErroEmail.style.display = "none"; }


        if (senhaDigitada.length < 8) {
            e.preventDefault();
            mensagemErroSenha.style.display = "block";
            mensagemErroSenha.innerHTML = "Senha inválida";
        }
        else { mensagemErroSenha.style.display = "none"; }
    }
    else { loginUser(e); }

    function loginUser(e) {
        e.preventDefault();

        let info = [];
        info.push(emailDigitado);
        info.push(senhaDigitada);
        postInfo(info);
        async function postInfo(info) {
            const res = await fetch(BASE_URL,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        parcel: info
                    })
                });

            let resp = await res.json();
            if (resp.success == false) {
                mensagemErroEmail.style.display = "block";
                mensagemErroEmail.innerHTML = "Email não cadastrado ou senha incorreta!";
            }
            else {
                let id = resp.id;
                document.location.href = `http://localhost:3000/home/${id}`;
            }
        }
    }
});