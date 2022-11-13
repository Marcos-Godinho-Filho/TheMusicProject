const reader = new FileReader();
const fileInput = document.querySelector("#fileReader");
const img = document.querySelector("#img-button");
reader.onload = e => {
    img.src = e.target.result;
    img.style.width = '120px';
    img.style.height = '120px';
}
fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    reader.readAsDataURL(f);
})

document.querySelector('#delete').addEventListener('click', () => {
    let id = '#deleteUserBox';
    let deletePlaylistBoxContent = `
        <h1 class="boxTitle"> Deletar Usuário </h1>
        <p class="message"> Tem certeza que deseja deletar o Usuário? (Esta ação é irreversível. Todas as suas playlists e músicas salvas serão perdidas) </p>
        <div class="password">
            <p class="message"> Digite sua senha para deletar: </p>
            <input type="text">
        </div>
        <div class="options-buttons">
            <button id="deleteUser"> Deletar </button>
            <button id="calcelDeleteUser"> Cancelar </button>
        </div>
    `;
    showBox(id, deletePlaylistBoxContent);

    document.querySelector('#deleteUser').addEventListener('click', () => {
        hideBox(id);

        /* comandos para deletar a playlist no BD */

        window.location.href = "../Authentication/Login In Page.html"
    })

    document.querySelector('#calcelDeleteUser').addEventListener('click', () => {
        hideBox(id);
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    let id = '#editUserBox';
    let editBoxContent = `
        <h1 class="boxTitle"> Editar Usuário </h1>
        <div class="card-image">
            <label for="cor">
                <input type="color" name="cor" id="cor" class="cor" value="#ff0000">
            </label>
        </div> 
        <div id="edit-image">
            <button id="edit-img-button" onclick="document.getElementById('fileReader').click()">
                <img id="img-button" alt="Browse" src="${document.querySelector('#t-img').src}">
            </button>
            <input type="file" id="fileReader" accept="image/*">
        </div>
        <div id="edit-data">
            <input type="text" id="newUsername" value="Playlist 1"> </input> 
            <textarea id="newBio">Descrição</textarea>
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

    document.querySelector('#saveEditPlaylist').addEventListener('click', () => {
        /* comandos para salvar a edição no BD */

        document.querySelector('#title').innerHTML = document.querySelector('#newTitle').value
        document.querySelector('#description').innerHTML = document.querySelector('#newDescription').value;
        const img = document.querySelector('#t-img');
        img.src = document.querySelector('#img-button').src;
        img.style.width = '220px';
        img.style.height = '220px';
        hideBox(id);
    })

    document.querySelector('#calcelEditPlaylist').addEventListener('click', () => {
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