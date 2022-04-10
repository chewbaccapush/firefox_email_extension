window.onload = () => {
    let encryptButton = document.getElementById("encryptButton");
    encryptButton.onclick = () => encryptMessage();

    generateKeysTable();
}

const encryptMessage = async() => {
    let recipient = document.getElementById('recipient').value;
    let message = document.getElementById('message').value;
    let senderMail = localStorage.key(0);
    let senderPrivateKeys = JSON.parse(localStorage.getItem(senderMail));
    let selectedKeyIndex = document.getElementById('keys').value;
    senderPrivateKey = senderPrivateKeys[selectedKeyIndex];
    let passphrase = document.getElementById('passphrase').value;

    const rawResponse = await fetch('http://localhost:3000/generateKey', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({recipient: recipient, message: message, senderPrivateKey: senderPrivateKey, passphrase: passphrase})
      });
      const content = await rawResponse.json();
}

const generateKeysTable = async() => {
    let senderMail = localStorage.key(0);
    let keys = JSON.parse(localStorage.getItem(senderMail)) || [];
    
    let select = document.createElement("select");
    select.name = "keys";
    select.id = "keys";

    for (const key of keys)
    {
        let option = document.createElement("option");
        option.value = keys.indexOf(key);
        option.innerText = keys.indexOf(key) +1;
        select.appendChild(option);
    }

    let label = document.createElement("label");
    label.id = "labelInput"
    label.innerText = "Select a key: "
    label.htmlFor = "keys";

    let div = document.getElementById("selectKeyContainer");
    div.appendChild(label).appendChild(select);
}