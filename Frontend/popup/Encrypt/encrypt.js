window.onload = () => {
    let encryptButton = document.getElementById("encryptButton");
    encryptButton.onclick = () => encryptMessage();
}

const encryptMessage = async() => {
    let recipient = document.getElementById('recipient').value;
    let message = document.getElementById('message').value;
    let senderPrivateKey = localStorage.getItem('privateKey');

    let toEncrypt = {recipient: recipient, message: message, senderPrivateKey: senderPrivateKey};

    fetch("localhost:3000/encrypt",
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