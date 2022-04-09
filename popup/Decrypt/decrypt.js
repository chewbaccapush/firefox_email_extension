window.onload = function() {
    let decryptButton = document.getElementById('decryptButton');
   
 
    decryptButton.addEventListener('click', function() {
        let encryptedMessage = document.getElementById('decryptMessage').value;
        let passphrase = document.getElementById('decryptPassword').value;
        let email = document.getElementById('emailForKey').value;
        decryptMessage(encryptedMessage, passphrase, email);
    });

};

async function decryptMessage(encryptedMessage, passphrase, email) {

    let decryptedMessage;

    let armoredKey = await getKey(email);

    fetch("https://europe-west3-firefoxextension.cloudfunctions.net/decrypt",
    {
        method: "POST",
        body: JSON.stringify({passphrase: passphrase, encryptedMessage: encryptedMessage, armoredKey: armoredKey})
    })
    .then((res) => {
        console.log(res);
        if (res.isJson()) decryptedFile = JSON.parse(res);
        else decryptedFile = res;
    })
    .catch((e) => {console.log(e)})
}

const getKey = async(email) => {
   
    fetch("https://europe-west3-firefoxextension.cloudfunctions.net/getKeys",
    {
        method: "POST",
        body: JSON.stringify({email: email})
    })
    .then((res) => {
        console.log(res.data)
        return res.data
    })
    .catch((e) => { console.log(e) })
}