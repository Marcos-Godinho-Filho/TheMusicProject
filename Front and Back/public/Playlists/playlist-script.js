document.querySelector('#play').addEventListener('click', () => {

})

document.querySelector('#delete').addEventListener('click', () => {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#header').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
    deleteConfirmation.innerHTML = `
        <h1> Você tem certeza que deseja deletar a Playlist? </h1>
        <button id="deletePlaylist"> Deletar </button>
        <button id="calcelDeletePlaylist"> Cancelar </button>
    `;
    deleteConfirmation.style.display = 'block';

    document.querySelector('#deletePlaylist').addEventListener('click', () => {
        document.querySelector('#aside').style.filter = 'none';
        document.querySelector('#header').style.filter = 'none';
        document.querySelector('#main').style.filter = 'none';
        window.location.href = "../Home/home.html"
        const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
        deleteConfirmation.style.display = 'none';
        deleteConfirmation.innerHTML = '';

        /* comandos para deletar no banco de dados */
    })

    document.querySelector('#cancelDeletePlaylist').addEventListener('click', () => {
        document.querySelector('#aside').style.filter = 'none';
        document.querySelector('#header').style.filter = 'none';
        document.querySelector('#main').style.filter = 'none';
        const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
        deleteConfirmation.style.display = 'none';
        deleteConfirmation.innerHTML = '';
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#header').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const editBox = document.querySelector('#editBox');
    editBox.innerHTML = `
        <h1 id="Editar">
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
        <button id="editPlaylist"> </button>
        <button id="calcelEditPlaylist"> </button>
        `;
    editBox.style.display = 'block';

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
})

// const reader = new FileReader();
// const fileInput = document.getElementById("");
// const img = document.getElementById("img");
// reader.onload = e => {
//   img.src = e.target.result;
// }
// fileInput.addEventListener('change', e => {
//   const f = e.target.files[0];
//   reader.readAsDataURL(f);
// })