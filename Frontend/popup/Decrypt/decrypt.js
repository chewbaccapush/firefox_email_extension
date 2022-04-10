window.onload = function () {
    let generateButton = document.getElementById('decryptButton');

    generateButton.addEventListener('click', function () {
        let message = document.getElementById('decryptMessage').value;
        let password = document.getElementById('decryptPassword').value;
        let email = document.getElementById('decryptEmail').value;
        decryptMessage(message, password, email);
    });
    generateKeysTable();
};

//Generate key
async function decryptMessage(message, password, email) {
    console.log("decrypting...");

    let senderMail = localStorage.key(0);
    let senderPrivateKeys = JSON.parse(localStorage.getItem(senderMail));
    let selectedKeyIndex = document.getElementById('keys').value;
    let recipientPrivateKey = senderPrivateKeys[selectedKeyIndex];

    // console.log(email);
    // console.log(password);

    const rawResponse = await fetch('http://localhost:3000/decrypt', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            recipientPrivateKey: recipientPrivateKey,
            senderEmail: email,
            passphrase: password
        })
    });

    const content = await rawResponse.json();
    console.log("dec ", content);
    document.getElementById("decryptMessage").value = content.decrypted;
}

const generateKeysTable = async () => {
    let senderMail = localStorage.key(0);
    let keys = JSON.parse(localStorage.getItem(senderMail)) || [];

    let select = document.createElement("select");
    select.name = "keys";
    select.id = "keys";

    for (const key of keys) {
        let option = document.createElement("option");
        option.value = keys.indexOf(key);
        option.innerText = keys.indexOf(key) + 1;
        select.appendChild(option);
    }

    let label = document.createElement("label");
    label.id = "labelInput"
    label.innerText = "Select a key: "
    label.htmlFor = "keys";

    let div = document.getElementById("selectKeyContainer");
    div.appendChild(label).appendChild(select);
}