let inputBoxNome = document.querySelector("#name")
let inputBoxEmail = document.querySelector("#email")
let inputBoxSenha = document.querySelector("#password")
let inputBoxConfSenha = document.querySelector("#confpassword")

let mensagemErroNome = document.querySelector("#mensagemErroNome")
let mensagemErroEmail = document.querySelector("#mensagemErroEmail")
let mensagemErroSenha = document.querySelector("#mensagemErroSenha")
let mensagemErroConfirmarSenha = document.querySelector("#mensagemErroConfirmarSenha")

let botaoCadastro = document.querySelector("#botaoCadastro")

const BASE_URL = window.location.href
const EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

botaoCadastro.addEventListener('click', (e) => {

    let nomeDigitado = inputBoxNome.value + ""
    let emailDigitado = inputBoxEmail.value + ""
    let senhaDigitada = inputBoxSenha.value + ""
    let confirmacaoSenhaDigitada = inputBoxConfSenha.value + ""

    if (nomeDigitado.trim() == "" || !emailDigitado.match(EMAIL_PATTERN) || senhaDigitada.length < 8 || senhaDigitada != confirmacaoSenhaDigitada) {
        if (senhaDigitada.trim() == "") {
            mensagemErroNome.style.display = "block"
            mensagemErroNome.innerHTML = "Nome de usuário inválido"
            e.preventDefault()
        }
        else { mensagemErroNome.style.display = "none" }

        if (!emailDigitado.match(EMAIL_PATTERN)) {
            mensagemErroEmail.style.display = "flex"
            mensagemErroEmail.innerHTML = "Padrão de email incorreto"
            e.preventDefault()
        }
        else { mensagemErroEmail.style.display = "none" }

        if (senhaDigitada.length < 8) {
            mensagemErroSenha.style.display = "flex"
            mensagemErroSenha.innerHTML = "A senha deve ter no mínimo 8 caracteres"
            e.preventDefault()
        }
        else { mensagemErroSenha.style.display = "none" }

        if (senhaDigitada != confirmacaoSenhaDigitada) {
            mensagemErroConfirmarSenha.style.display = "flex"
            mensagemErroConfirmarSenha.innerHTML = "A confirmação de senha deve ser a mesma que a senha digitada"
            e.preventDefault()
        }
        else { mensagemErroConfirmarSenha.style.display = "none" }
    }
    else { cadastrar(e) }


    function cadastrar(e) {
        e.preventDefault()
        // Armazenamos as informacoes passadas pelo usuario para um vetor e mandamos esse vetor como parcela para o backend
        let info = []
        info.push(emailDigitado)
        info.push(nomeDigitado)
        info.push(senhaDigitada)

        postInfo(info)
        async function postInfo(info) {
            if (info == "") { return }
            const res = await fetch('http://localhost:3000/registration',
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    parcel: info
                })
            })
            let resp = await res.json()
            if (resp.success == false) {
                mensagemErroEmail.style.display = "flex"
                mensagemErroEmail.innerHTML = "Email já cadastrado!"
            }
            else 
            {
                let id = resp.id
                window.location.href = `http://localhost:3000/home/${id}`
            }
        }
    }
})