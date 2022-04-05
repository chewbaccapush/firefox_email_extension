
//Dinamično nalaganje ključev v tabelo in dropdown
window.onload = function() {
    //Get keys from storage...

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

};

//Encrypt button
const encryptMessage = () => {
    let recipient = document.getElementById('recipient').value;
    let messege = document.getElementById('message').value;
    let key = document.getElementById('keys').value;
}

//Decrypt button
const decryptMessage = () => {
    let encryptedFile = document.getElementById('fileInput').value;


}

//Generate key
const generateKey = () => {
    fetch('http://127.0.0.1:5000/generateKey')
        .then(response => response.json())
        .then(data => console.log(data));
   
    //Shrani ključ v storage
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



