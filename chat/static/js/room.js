const roomName = JSON.parse(document.getElementById('room-name').textContent);
var fileArrayBuffer = ""
const textKey = localStorage.getItem("textKey");
console.log('Key: ', textKey);
const key = aesjs.utils.utf8.toBytes(textKey);
console.log('Uint8Array Key:', key);

function downloadBlob(blob, name = 'file.txt') {
    if (
        window.navigator &&
        window.navigator.msSaveOrOpenBlob
    ) return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}

document.querySelector('#chat-message-input').focus();



document.querySelector('#chat-file-input').addEventListener('change', function () {
    var fr = new FileReader();
    fr.onload = function (e) {
        fileArrayBuffer = fr.result;
        console.log("File ArrayBuffer: ")
        console.log('name', fr);
        console.log(fileArrayBuffer);
    }
    fr.readAsArrayBuffer(this.files[0]);

})

document.querySelector('#chat-file-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-submit').click();
    }
};

document.querySelector('#chat-submit').onclick = function (e) {
    const inputFileName = document.getElementById("chat-file-input").files[0].name;
    const inputMessage = document.getElementById("chat-message-input").value;
    const fileUint8Array = new Uint8Array(fileArrayBuffer);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const encryptedFileUint8Array = aesCtr.encrypt(fileUint8Array);
    console.log('File Uint8Array: ', fileUint8Array);
    console.log('Encrypted: ', encryptedFileUint8Array);
    chatSocket.send(JSON.stringify({
        'encryptedFile': encryptedFileUint8Array,
        'message': inputMessage,
        'fileName': inputFileName,
    }))
};

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

chatSocket.onmessage = function (e) {
//
    const data = JSON.parse(e.data);
    const receiveUint8Array = new Uint8Array(Object.values(data.encryptedFile));
    const receiveMessage = data.message
    const receiveFileName = data.fileName
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptUint8Array = aesCtr.decrypt(receiveUint8Array);
    const fileBuffer = decryptUint8Array.buffer;
    document.querySelector('#chat-log').value += (receiveMessage + '\n');
    const blob = new Blob([fileBuffer]);
    const button = document.createElement("button");
    button.innerHTML = receiveFileName;
    const div = document.querySelector("#file-output");
    div.appendChild(button);
    button.addEventListener("click", function () {
        downloadBlob(blob, receiveFileName);
    });
    console.log('Receive data: ', data);
    console.log('Receive fileUint8Array: ', receiveUint8Array);
    console.log('Decrypted Uint8Array: ', decryptUint8Array);
    console.log('Decrypted File Buffer: ', fileBuffer);
};
