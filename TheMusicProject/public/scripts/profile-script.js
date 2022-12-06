const BASE_URL = window.location.href

let idUser = BASE_URL.substring(30)

document.querySelector('#delete').addEventListener('click', () => {
    let idBox = '#deleteUserBox'
    let deleteUserBoxContent = `
        <h1 class="boxTitle"> Deletar Usuário </h1>
        <p class="warningMessage"> Esta ação é irreversível. Todas as suas playlists e músicas salvas serão perdidas. </p>
        <div class="options-buttons">
            <button id="deleteUser"> Deletar </button>
            <button id="calcelDeleteUser"> Cancelar </button>
        </div>
    `
    showBox(idBox, deleteUserBoxContent)

    document.querySelector('#deleteUser').addEventListener('click', () => {

        async function deleteUser(e) {
            const res = await fetch(BASE_URL + '/deleteUser', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: idUser
                })
            })
        }

        deleteUser()
        hideBox(idBox)
        window.location.href = "/authentication/"
    })

    document.querySelector('#calcelDeleteUser').addEventListener('click', () => {
        hideBox(idBox)
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    let id = '#editUserBox'
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
            <input type="text" id="newUsername" value="${document.querySelector('#username').innerHTML.trim()}"> </input> 
            <textarea maxlength="100" id="newBio" resize="none">${document.querySelector('#bio').innerHTML.trim()}</textarea>
        </div>
        <div class="options-buttons">
            <button id="saveEditUser"> Salvar </button>
            <button id="calcelEditUser"> Cancelar </button>
        </div>
        `
    showBox(id, editBoxContent)

    let previousImg = ''

    const reader = new FileReader()
    const fileInput = document.querySelector("#fileReader")
    const img = document.querySelector("#img-button")
    reader.onload = e => {
        img.src = e.target.result
        previousImg = img.src
        img.style.width = '120px'
        img.style.height = '120px'
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0]
        reader.readAsDataURL(f)
    })

    document.querySelector('#edit-img-button').addEventListener('mouseover', () => {
        previousImg = img.src
        img.src = '../imgs/browse.png'
        img.style.width = '120px'
        img.style.height = '120px'
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg
        img.style.width = '120px'
        img.style.height = '120px'
    })

    document.querySelector('#saveEditUser').addEventListener('click', () => {
        putUser()

        async function putUser(e) {
            const res = await fetch(BASE_URL + '/updateUser', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newUsername').value,
                    imagemPerfil: document.querySelector('#img-button').src,
                    descPerfil: document.querySelector('#newBio').value,
                    corFundo: document.querySelector('#color').value,
                })
            })
        }

        document.querySelector('#username').innerHTML = document.querySelector('#newUsername').value
        document.querySelector('#bio').innerHTML = document.querySelector('#newBio').value
        document.querySelector('.card-color').style.backgroundColor = document.querySelector('#color').value
        const img = document.querySelector('#profile-img')
        img.src = document.querySelector('#img-button').src
        img.style.width = '120px'
        img.style.height = '120px'
        hideBox(id)
    })

    document.querySelector('#calcelEditUser').addEventListener('click', () => {
        hideBox(id)
    })
})

document.querySelector('#createPlaylist').addEventListener('click', () => {
    let id = '#createPlaylistBox'
    let createPlaylistBoxContent = `
            <h1 class="boxTitle"> Criar Playlist </h1>
            <div id="edit-image-cp">
                <button id="edit-img-button-cp" onclick="document.getElementById('fileReader-cp').click()">
                    <img id="img-button-cp" alt="Browse" src="../imgs/playlist-icon.png">
                </button>
                <input type="file" id="fileReader-cp" accept="image/*">
            </div>
            <div id="edit-data-cp">
                <input type="text" id="newTitle" value="Nome"> </input> 
                <textarea maxlength="100" id="newDescription" resize="none">Descrição</textarea>
            </div>
            <div class="options-buttons">
                <button id="confirmCreatePlaylist"> Criar </button>
                <button id="calcelCreatePlaylist"> Cancelar </button>
            </div>
            `
    showBox(id, createPlaylistBoxContent)

    let previousImg = ''

    const reader = new FileReader()
    const fileInput = document.querySelector("#fileReader-cp")
    const img = document.querySelector("#img-button-cp")
    reader.onload = e => {
        img.src = e.target.result
        previousImg = img.src
        img.style.width = '200px'
        img.style.height = '200px'
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0]
        reader.readAsDataURL(f)
    })

    document.querySelector('#edit-img-button-cp').addEventListener('mouseover', () => {
        previousImg = img.src
        img.src = '../imgs/browse.png'
        img.style.width = '200px'
        img.style.height = '200px'
    })
    document.querySelector('#edit-img-button-cp').addEventListener('mouseout', () => {
        img.src = previousImg
        img.style.width = '200px'
        img.style.height = '200px'
    })

    document.querySelector('#confirmCreatePlaylist').addEventListener('click', () => {
        async function createPlaylist(e) {
            const res = await fetch(BASE_URL + '/insertPlaylist', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newTitle').value,
                    descricao: document.querySelector('#newDescription').value,
                    imagem: document.querySelector('#img-button-cp').src,
                })
            })

            const data = await res.json()
            let idPl = data.idPl
            window.location.href = `http://localhost:3000/playlist/${idUser}/${idPl}`
        }

        createPlaylist()
        hideBox(id)
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id)
    })
})

document.querySelector("#logout").addEventListener('click', () => {
    let id = '#logoutBox'
    let logoutBoxContent = `
        <h1 class="boxTitle"> Sair da conta </h1>
        <p class="message"> Tem certeza que deseja sair da conta? </p>
        <div class="options-buttons">
            <button id="logout"> Sair </button>
            <button id="calcelLogout"> Cancelar </button>
        </div>
    `
    showBox(id, logoutBoxContent)

    document.querySelector('#logout').addEventListener('click', () => {
        hideBox(id)

        window.location.href = `http://localhost:3000/authentication`
    })

    document.querySelector('#calcelLogout').addEventListener('click', () => {
        hideBox(id)
    })
})

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)'
    document.querySelector('#main').style.filter = 'blur(7px)'
    const box = document.querySelector(id)
    box.innerHTML = content
    box.style.display = 'block'
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none'
    document.querySelector('#main').style.filter = 'none'
    const box = document.querySelector(id)
    box.innerHTML = ''
    box.style.display = 'none'
}

let showDBResult = function (success) {
    const box = document.querySelector('#dbResultBox')
    box.display = "block"

    if (success) {
        box.innerHTML = "A operação feita com sucesso!"
        box.style.backgroundColor = "#66ff99"
    }
    else {
        box.innerHTML = "Erro! A operação falhou!"
        box.style.backgroundColor = " #ff8080"
    }

    setTimeout(() => {
        box.innerHTML = ""
        box.display = "none"
    }, 3000)
}

document.onkeypress = function(e){
    e = e || window.event

    if(e.keyCode === 14){
        document.documentElement.classList.toggle("dark-mode")
    }
}