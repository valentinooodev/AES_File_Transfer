document.querySelector('#room-name-input').focus();
document.querySelector('#room-name-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#room-name-submit').click();
    }
};

document.querySelector('#room-name-submit').onclick = function (e) {
    var roomName = document.querySelector('#room-name-input').value;
    var textKey = document.querySelector('#key-input').value;
    if (textKey.length == 16 || textKey.length == 24 || textKey.length == 32) {
        localStorage.removeItem("textKey");
        localStorage.setItem("textKey", textKey);
        window.location.pathname = '/room/' + roomName + '/';
    } else {
        window.alert("Key length must be 16, 24 or 32 !");
    }
}