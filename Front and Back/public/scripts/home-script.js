document.addEventListener("DOMContentLoaded", function () {
    let fadeComplete = function (e) {
        stage.appendChild(arr[0]);
    };
    let stage = document.getElementById("slider");
    let arr = stage.getElementsByClassName("slider-a");
    for (var i = 0; i < arr.length; i++) {
        arr[i].addEventListener("animationend", fadeComplete, false);
    }

}, false);

document.querySelector('#createPlaylist').addEventListener('click', () => {
    /* comandos para criar uma nova playlist no BD com nome "Nova Playlist + idAtual", descrição nula e imagem nula, id é identity */

    /* comandos para redirecionar para a nova página, pegar os dados do BD e colocá-los no corpo da playlist */
})

document.addEventListener('load', getInfo);

const BASE_URL = 'http://localhost:3000/:id/home/';

async function getInfo(e) {
    let playlists = document.querySelector('.sidebar-playlists');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    let id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${playlists[pos].nomePlaylist}</a>`;
    }
}