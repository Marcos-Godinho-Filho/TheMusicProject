document.querySelector('#play').addEventListener('click', () => {

})

document.querySelector('#delete').addEventListener('click', () => {
    let id = '#deletePlaylistBox';
    let deletePlaylistBoxContent = `
        <h1> Você tem certeza que deseja deletar a Playlist? </h1>
        <button id="deletePlaylist"> Deletar </button>
        <button id="calcelDeletePlaylist"> Cancelar </button>
    `;
    showBox(id, deletePlaylistBoxContent);

    document.querySelector('#deletePlaylist').addEventListener('click', () => {
        hideBox(id);

        /* comandos para deletar a playlist no BD */

        window.location.href = "../Home/home.html"
    })

    document.querySelector('#cancelDeletePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    let id = 'editBox';
    let editBoxContent = `
        <h1> Editar </h1>
        <div id="edit-image">
            <img id="edit-img" src="../photos/top50brazil.jpg" alt="Img"> <br>
            <input type="file" value="" id="fileReader" accept="image/*">
        </div>
        <div id="edit-data">
            <label> Playlist: </label>
            <input type="text" id="title"> </input> 
            <label> Descrição: 
            <textarea id="description"> </textarea>
        </div>
        <button id="saveEditPlaylist"> Salvar </button>
        <button id="calcelEditPlaylist"> Cancelar </button>
        `;
    showBox(id, editBoxContent);

    const reader = new FileReader();
    const fileInput = document.querySelector("#fileReader");
    const img = document.querySelector("#edit-img");
    reader.onload = e => {
        img.src = e.target.result;
        img.style.width = '80%';
        img.style.height = '80%';
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0];
        reader.readAsDataURL(f);
    })

    document.querySelector('#saveEditPlaylist').addEventListener('click', () => {
        hideBox(id);

        /* comandos para salvar a edição no BD */
    })

    document.querySelector('#calcelEditPlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#header').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const box = document.querySelector(id);
    box.innerHTML = content;
    box.style.display = 'block';
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none';
    document.querySelector('#header').style.filter = 'none';
    document.querySelector('#main').style.filter = 'none';
    const box = document.querySelector(id);
    box.innerHTML = '';
    box.style.display = 'none';
}