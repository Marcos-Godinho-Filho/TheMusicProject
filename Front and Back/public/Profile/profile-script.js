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