document.addEventListener('load', getInfoLoad);

const BASE_URL = window.location.href;
let id;

async function getInfoLoad(e) {
    let playlists = document.querySelector('.sidebar-playlists');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${resultado[pos].nomePlaylist}</a>`;
    }
}

document.querySelector('#delete').addEventListener('click', () => {
    let id = '#deleteUserBox';
    let deleteUserBoxContent = `
        <h1 class="boxTitle"> Deletar Usuário </h1>
        <p class="warningMessage"> Esta ação é irreversível. Todas as suas playlists e músicas salvas serão perdidas. </p>
        <div>
            <p class="message"> Digite sua senha para confirmar a deleção: </p>
            <input id="passwordToDeleteUser" type="password">
        </div>
        <div class="options-buttons">
            <button id="deleteUser"> Deletar </button>
            <button id="calcelDeleteUser"> Cancelar </button>
        </div>
    `;
    showBox(id, deleteUserBoxContent);

    document.querySelector('#deleteUser').addEventListener('click', () => {
        
        async function deleteUser(e) {
            const res = await fetch (BASE_URL + '/deleteUser', {
                method: 'DELETE', 
                body: JSON.stringify({
                    id: idUser
                })
            })
        }
 
        deleteUser();
        hideBox(id);
        window.location.href = "/authentication/";
    })

    document.querySelector('#calcelDeleteUser').addEventListener('click', () => {
        hideBox(id);
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    let id = '#editUserBox';
    let editBoxContent = `
        <h1 class="boxTitle"> Editar Usuário </h1>
        <div class="card-color-edit">
            <label for="cor">
                <input type="color" name="cor" id="color" value="#ff0000">
            </label>
        </div> 
        <div id="edit-image">
            <button id="edit-img-button" onclick="document.getElementById('fileReader').click()">
                <img id="img-button" alt="Browse" src="${document.querySelector('#profile-img').src}">
            </button>
            <input type="file" id="fileReader" accept="image/*">
        </div>
        <div id="edit-data">
            <input type="text" id="newUsername" value="${document.querySelector('#username').innerHTML}"> </input> 
            <textarea id="newBio" resize="none">${document.querySelector('#bio').innerHTML}</textarea>
        </div>
        <div class="options-buttons">
            <button id="saveEditUser"> Salvar </button>
            <button id="calcelEditUser"> Cancelar </button>
        </div>
        `;
    showBox(id, editBoxContent);

    let previousImg = '';

    const reader = new FileReader();
    const fileInput = document.querySelector("#fileReader");
    const img = document.querySelector("#img-button");
    reader.onload = e => {
        img.src = e.target.result;
        previousImg = img.src;
        img.style.width = '120px';
        img.style.height = '120px';
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0];
        reader.readAsDataURL(f);
    })

    document.querySelector('#edit-img-button').addEventListener('mouseover', () => {
        previousImg = img.src;
        img.src = '../images/browse.png';
        img.style.width = '120px';
        img.style.height = '120px';
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg;
        img.style.width = '120px';
        img.style.height = '120px';
    })

    document.querySelector('#saveEditUser').addEventListener('click', () => {
        putUser();

        async function putUser (e) {
            const res = await fetch(BASE_URL + 'updateUser/', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newUsername').value,
                    email: document.querySelector('#email').value,
                    imagemPerfil: document.querySelector('#img-button').src,
                    descPerfil: document.querySelector('#newBio').value,
                    corFundo: document.querySelector('#color').value,
                })
            });
        } 

        document.querySelector('#username').innerHTML = document.querySelector('#newUsername').value
        document.querySelector('#bio').innerHTML = document.querySelector('#newBio').value;
        document.querySelector('.card-color').style.backgroundColor = document.querySelector('#color').value;
        const img = document.querySelector('#profile-img');
        img.src = document.querySelector('#img-button').src;
        img.style.width = '120px';
        img.style.height = '120px';
        hideBox(id);
    })

    document.querySelector('#calcelEditUser').addEventListener('click', () => {
        hideBox(id);
    })
})

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const box = document.querySelector(id);
    box.innerHTML = content;
    box.style.display = 'block';
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none';
    document.querySelector('#main').style.filter = 'none';
    const box = document.querySelector(id);
    box.innerHTML = '';
    box.style.display = 'none';
}

document.querySelector('#createPlaylist').addEventListener('click', () => {
    let id = '#createPlaylistBox';
    let createPlaylistBoxContent = `
            <h1 class="boxTitle"> Criar Playlist </h1>
            <div id="edit-image">
                <button id="edit-img-button" onclick="document.getElementById('fileReader').click()">
                    <img id="img-button" alt="Browse" src="../imgs/playlist-icon.png">
                </button>
                <input type="file" id="fileReader" accept="image/*">
            </div>
            <div id="edit-data">
                <input type="text" id="newTitle" value="Nome"> </input> 
                <textarea id="newDescription">Descrição</textarea>
            </div>
            <div class="options-buttons">
                <button id="confirmCreatePlaylist"> Criar </button>
                <button id="calcelCreatePlaylist"> Cancelar </button>
            </div>
            `;
    showBox(id, createPlaylistBoxContent);

    let previousImg = '';

    const reader = new FileReader();
    const fileInput = document.querySelector("#fileReader");
    const img = document.querySelector("#img-button");
    reader.onload = e => {
        img.src = e.target.result;
        previousImg = img.src;
        img.style.width = '200px';
        img.style.height = '200px';
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0];
        reader.readAsDataURL(f);
    })

    document.querySelector('#edit-img-button').addEventListener('mouseover', () => {
        previousImg = img.src;
        img.src = '../images/browse.png';
        img.style.width = '200px';
        img.style.height = '200px';
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg;
        img.style.width = '200px';
        img.style.height = '200px';
    })

    document.querySelector('#confirmCreatePlaylist').addEventListener('click', () => {

        async function putPlaylist(e) {
            const res = await fetch(BASE_URL + '/insertPlaylist', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newTitle').value,
                    descricao: document.querySelector('#newDescription').value,
                    imagem: document.querySelector('#img-button').src
                })
            });
        }

        putPlaylist();

        hideBox(id);
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})