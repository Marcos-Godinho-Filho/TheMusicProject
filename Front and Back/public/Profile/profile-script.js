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
        /* comandos para salvar a edição no BD */

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
    /* comandos para criar uma nova playlist no BD com nome "Nova Playlist + idAtual", descrição nula e imagem nula, id é identity */

    /* comandos para redirecionar para a nova página, pegar os dados do BD e colocá-los no corpo da playlist */
})