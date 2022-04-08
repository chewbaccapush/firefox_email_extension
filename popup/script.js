

window.onload = function() {
    //Get keys from storage...
    generateKeysTable();
  
  
};

//Dinamično nalaganje ključev v tabelo in dropdown
const generateKeysTable = async() => {
    // let userId = localStorage.getItem('userId') || 0;
    // let keys = await getKeys(userId);
    let keys = [];

    let select = document.createElement("select");
    select.name = "keys";
    select.id = "keys";

    for (const key of keys)
    {
        var option = document.createElement("option");
        option.value = key.id;
        option.name = key.name;
        select.appendChild(option);
    }

    let label = document.createElement("label");
    label.id = "labelInput"
    label.innerText = "Select a key: "
    label.htmlFor = "keys";

    document.getElementById("container").appendChild(label).appendChild(select);
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
const decryptMessage = () => {
    let encryptedFile = document.getElementById('fileInput').value;
    let decryptedFile;

    fetch("http://127.0.0.1:5000/decrypt",
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

//Generate key
const generateKey = async() => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let user = {email: email, password: password};
 
    fetch("http://127.0.0.1:5000/generateKey",
    {
        method: "POST",
        body: JSON.stringify(user)
    })
    .then((res) => {
        console.log(res);
        localStorage.setItem('userId', res.userId);
        generateKeysTable();
    })
    .catch((e) => {console.log(e)})

}

//Za dinamično dodajanje v tabelo
/*
let keys = [];
let table = document.getElementById('keysTable');
let tbody = document.createElement('tbody');

table.append(tbody);

for (const key of keys)
{
    let row = document.createElement('tr');
    let data_1  = document.createElement('td');
    data_1.innerHTML = key.name;
    let data_2 = document.createElement('td');
    data_2.innerHTML = key.email;
    let data_3 = document.createElement('td');
    data_3.innerHTML = key.id;
    row.appendChild(data_1);
    row.appendChild(data_2);
    row.appendChild(data_3);
    tbody.appendChild(row);
}
*/



