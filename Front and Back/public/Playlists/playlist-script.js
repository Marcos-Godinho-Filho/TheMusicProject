document.querySelector('#play').addEventListener('click', () => {

})

document.querySelector('#delete').addEventListener('click', () => {
    document.body.style.filter = 'blur(7px);';
    const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
    deleteConfirmation.style.fiter = 'none;';
    deleteConfirmation.className = 'appear';
    deleteConfirmation.innerHTML = `
        <h1> Você tem certeza que deseja deletar a Playlist? </h1>
        <button id="deletePlaylist"> </button>
        <button id="calcelDeletePlaylist"> </button>
    `;

    document.querySelector('#deletePlaylist').addEventListener('click', () => {
        document.body.style.filter = 'none;';
        window.location.href = "../Home/home.html"
        const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
        deleteConfirmation.style.filter = 'none;';
        deleteConfirmation.className = '';
        deleteConfirmation.innerHTML = '';

        /* comandos para deletar no banco de dados */
    })

    document.querySelector('#cancelDeletePlaylist').addEventListener('click', () => {
        document.body.style.filter = 'none;';
        const deleteConfirmation = document.querySelector('#deletePlaylistConfirmation');
        deleteConfirmation.style.filter = 'none;';
        deleteConfirmation.className = '';
        deleteConfirmation.innerHTML = '';
    })
})

document.querySelector('#edit').addEventListener('click', () => {
    document.body.style.filter = 'blur(7px);';
    const editBox = document.querySelector('#editBox');
    editBox.style.filter = 'none;';
    editBox.className = 'appear;';
    editBox.innerHTML = `
        <div id="edit-image">
            <img id="edit-img" src="../photos/top50brazil.jpg" alt="Img">
            <input type="file">
        </div>
        <div id="edit-data">
            <h1 id="title">Playlist 1</h1>
            <h2 id="description">Uma playlist para ouvir quando estiver sozinho</h2>
            <p id="songCount">2 músicas</p>
        </div>
    `;
})
