function carregarMenu() {
    document.querySelector('#menu').style.marginTop = '0vh';
}
function voltar() {
    document.querySelector('#menu').style.marginTop = '-50vh';
}

document.querySelector('#irparamenu').onclick = carregarMenu();
document.querySelector('#voltar').onclick = voltar();

let buscarBtn = document.querySelector("#search");
let inpBx = document.querySelector("#inputBox");
let results = document.querySelector("#results");

const baseUrl = 'http://localhost:3000/';
inpBx.addEventListener('input', buscar);

buscarBtn.addEventListener('click', buscar);


function buscar(e) {
    results.innerHTML = 'Resultados da Busca...'

    e.preventDefault();
    postInfo();
    getInfo();

    async function postInfo(e) // async --> funciona ao mesmo tempo (assincrono)
    {
        if (inpBx.value == "") {
            return
        }
        const res = await fetch(baseUrl, // espera executar a função para poder continuar
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    parcel: inpBx.value
                })
            });
    }

    setTimeout(getInfo, 1000);

    async function getInfo(e) {
        //e.preventDefault();
        // alert("Chegou no getInfo()");
        const res = await fetch(baseUrl + 'info/test?key=busca',
            {
                method: 'GET'
            });

        console.log(res);
        const data = await res.json();

        let resultado = data.info;

        // resultado (retorno) = [{a, b, c}, {a, b, c}]

        for (let pos = 0; pos < resultado.length; pos++) {
            let title = resultado[pos]["title_short"];
            let artist = resultado[pos]["artist"];
            let album = resultado[pos]["album"];
            let duration = resultado[pos]["duration"];
            let image = resultado[pos]["image"];
            let preview = resultado[pos]["preview"];

            results.innerHTML += `
                <div class="song">
                    <div class="items-song" id="s-image">
                        <img src="${image}" alt="" class="imagem">
                    </div>
                    <div class="items-song" id="s-data">
                        <h1>${title}</h1>
                        <h2>${artist}</h2>
                        <h2>${album}</h2>
                    </div>
                    <div class="items-song">
                        <audio controls id="clickToPlay">
                            <source id="audio" src=${preview}>
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                    <div class="items-song" id="s-time">
                        <h1>${duration}</h1>
                    </div>
                </div>
                `;
        }
    }
}
