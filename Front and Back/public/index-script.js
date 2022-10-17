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

buscarBtn.addEventListener('click', buscar);

inpBx.addEventListener('keyup', function(e) {
    e.preventDefault();
    let tecla = e.keyCode;
    if (tecla === 13)
        buscarBtn.click();
})

function buscar(e) {
    results.innerHTML = 'Buscando...';
    setTimeout(getInfo, 2000);

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

    async function getInfo(e) {
        const res = await fetch(baseUrl + 'info/test?key=busca', {
            method: 'GET'
        });

        console.log(res);
        const data = await res.json();

        let resultado = data.info;

        if (resultado.length == 0)
            results.innerHTML = "Sem resultados para a busca"
        else
            results.innerHTML = 'Resultados da Busca';


        for (let pos = 0; pos < resultado.length; pos++) {
            let title = resultado[pos]["title_short"];
            let artist = resultado[pos]["artist"];
            let album = resultado[pos]["album"];
            let image = resultado[pos]["image"];
            let preview = resultado[pos]["preview"];

            results.innerHTML += `
                <div class="song">
                    <div class="items-song" id="s-image">
                        <img src="${image}" alt="" class="image">
                    </div>
                    <div class="items-song" id="s-data">
                        <h1>${title}</h1>
                        <h2>${artist}</h2>
                        <h2>${album}</h2>
                    </div>
                    <div class="items-song">
                        <a href="${preview}">
                        </a>
                    </div>
                </div>
                `;
        }
    }
}

var audioplayer = document.getElementById('audioplayer');
var loaded = false;

var playBtn = document.getElementById('playBtn');
var pauseBtn = document.getElementById('pauseBtn');

playBtn.addEventListener('click', (e) => {
    e.preventDefault();

    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";

});


pauseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none ";
    audioplayer.pause();

});

playSong = (file) => {

    if (loaded == false) {
        audioplayer.innerHTML = `<source src="` + file + ` " type="audio/mp3" />`;
        loaded = true;
    }

    audioPlayer.play();

    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";

}

document.querySelectorAll('.main-col').forEach(item => {

    item.addEventListener('click', event => {

        let image = item.getAttribute('data-image');
        let artist = item.getAttribute('data-artist');
        let song = item.getAttribute('data-song');
        let file = item.getAttribute('data-file');

        let playerArtistComponent = document.getElementsByClassName("player-artist");

        playerArtistComponent[0].innerHTML = `
                
                <img src="` + image + ` "/>
                <h3>` + song + `<br><span>` + artist + `</span></h3>
                
                `;

        playSong(file)
    });

})