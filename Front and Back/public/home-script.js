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