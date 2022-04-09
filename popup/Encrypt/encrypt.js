window.onload = () => {
    let encryptButton = document.getElementById("encryptButton");
    encryptButton.onclick = () => encryptMessage();
}

const encryptMessage = async() => {
    let recipient = document.getElementById('recipient').value;
    let message = document.getElementById('message').value;
    let key = document.getElementById('keys').value;

    let toEncrypt = {recipient: recipient, message: message, key: key};

    fetch("https://europe-west3-firefoxextension.cloudfunctions.net/encrypt",
    {
        method: "POST",
        body: JSON.stringify(toEncrypt)
    })
    .then((res) => {
        console.log(res);
        return res;
    })
     .catch((e) => {console.log(e)})
}