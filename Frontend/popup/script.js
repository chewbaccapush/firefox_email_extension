
//Dinamično nalaganje ključev v tabelo in dropdown
const generateKeysTable = async() => {
    // let userId = localStorage.getItem('userId') || 0;
    // let keys = await getKeys(userId);
    let keys = [{id: "00", name: "haha"}];
    
    let select = document.createElement("select");
    select.name = "keys";
    select.id = "keys";

    for (const key of keys)
    {
        let option = document.createElement("option");
        option.value = key.id;
        option.name = key.name;
        select.appendChild(option);
    }

    let label = document.createElement("label");
    label.id = "labelInput"
    label.innerText = "Select a key: "
    label.htmlFor = "keys";

    let div = document.getElementById("selectKeyContainer");
    div.appendChild(label).appendChild(select);
}

//Get keys of a user
const getKeys = async(id) => {
   
    fetch("http://127.0.0.1:5000/getKeysById" + query,
    {
        method: "POST",
        body: JSON.stringify(id)
    })
    .then((res) => {
        console.log(res)
        if (res.isJson()) return JSON.parse(res)
        else return res;
    })
    .catch((e) => { console.log(e) })
}

//Encrypt button
const encryptMessage = async() => {
    let recipient = document.getElementById('recipient').value;
    let message = document.getElementById('message').value;
    let key = document.getElementById('keys').value;

    let toEncrypt = {recipient: recipient, message: message, key: key};
    let encryptedFile;

    fetch("http://127.0.0.1:5000/encrypt",
    {
        method: "POST",
        body: JSON.stringify(toEncrypt)
    })
    .then((res) => {
        console.log(res);
        if (res.isJson()) encryptedFile = JSON.parse(res);
        else encryptedFile = res;
    })
    .catch((e) => {console.log(e)})
}



//Decrypt button
function decryptMessage() {
    let encryptedFile = document.getElementById('fileInput');
    console.log(encryptedFile);
    let decryptedFile;

    fetch("https://europe-west3-firefoxextension.cloudfunctions.net/decrypt",
    {
        method: "POST",
        body: JSON.stringify(encryptedFile)
    })
    .then((res) => {
        console.log(res);
        if (res.isJson()) decryptedFile = JSON.parse(res);
        else decryptedFile = res;
    })
    .catch((e) => {console.log(e)})
}


//Download function
function download(text, name) {
    let div = document.getElementById('download');
    let a = document.createElement('a');
    let file = new Blob([text], {type: text});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.className = 'decryptButton'
    div.append(a);
}









